"""
GRI ETL Pipeline — Apache Airflow DAG
Orchestrates: Crawl → Download → Transform → Validate → Load

Schedule: Daily at 02:00 IST (20:30 UTC)

Author  : Vijay Mahes
Version : 1.0.0
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.utils.task_group import TaskGroup


# ─────────────────────────────────────────────
# DAG Default Arguments
# ─────────────────────────────────────────────

DEFAULT_ARGS = {
    "owner":            "vijaymahes",
    "depends_on_past":  False,
    "email":            ["Vijaypradhap2004@gmail.com"],
    "email_on_failure": True,
    "email_on_retry":   False,
    "retries":          2,
    "retry_delay":      timedelta(minutes=5),
    "start_date":       datetime(2026, 8, 1),
}

DATA_DIR = "/opt/airflow/gri_data/data_collection"


# ─────────────────────────────────────────────
# Python Task Functions
# ─────────────────────────────────────────────

def run_bs4_scraper(**kwargs):
    """Execute BeautifulSoup4 static page scraper."""
    import subprocess
    result = subprocess.run(
        ["python", f"{DATA_DIR}/scrapers/gri_bs4_parser.py"],
        capture_output=True, text=True, timeout=300
    )
    print(result.stdout)
    if result.returncode != 0:
        raise RuntimeError(f"BS4 scraper failed:\n{result.stderr}")


def run_playwright_scraper(**kwargs):
    """Execute Playwright dynamic page scraper."""
    import subprocess
    result = subprocess.run(
        ["python", f"{DATA_DIR}/scrapers/gri_playwright_spider.py"],
        capture_output=True, text=True, timeout=600
    )
    print(result.stdout)
    if result.returncode != 0:
        raise RuntimeError(f"Playwright scraper failed:\n{result.stderr}")


def download_pdfs(**kwargs):
    """Download all discovered PDF documents from GRI website."""
    import requests
    import os

    PDF_URLS = [
        ("https://ruraluniv.ac.in/includes/admissions/2026/pdf/Prospectus_202627.pdf", "Prospectus_2026-27.pdf"),
        ("https://ruraluniv.ac.in/includes/admissions/2025/pdf/Prospectus_202526.pdf", "Prospectus_2025-26.pdf"),
        ("http://ruraluniv.ac.in/includes/examination/pdf/Application_Transcript.pdf", "Application_Transcript.pdf"),
        ("http://ruraluniv.ac.in/includes/examination/pdf/DuplicateCertificate.pdf",   "Duplicate_Certificate.pdf"),
        ("http://ruraluniv.ac.in/includes/examination/pdf/e-sanad301221.pdf",           "eSanad_notification.pdf"),
        ("http://ruraluniv.ac.in/includes/studcorner/pdf/ugc_cc221217.pdf",             "UGC_Compliance_PhD.pdf"),
    ]

    pdf_dir = f"{DATA_DIR}/data/pdfs"
    os.makedirs(pdf_dir, exist_ok=True)

    for url, filename in PDF_URLS:
        dest_path = os.path.join(pdf_dir, filename)
        if os.path.exists(dest_path):
            print(f"[SKIP] Already downloaded: {filename}")
            continue
        try:
            r = requests.get(url, timeout=30, headers={"User-Agent": "GRI-DataBot/1.0"})
            r.raise_for_status()
            with open(dest_path, "wb") as f:
                f.write(r.content)
            print(f"[PDF] Downloaded: {filename} ({len(r.content)//1024} KB)")
        except Exception as e:
            print(f"[PDF ERROR] {filename}: {e}")


def validate_schemas(**kwargs):
    """Validate all scraped JSON files against their schemas."""
    import json
    import jsonschema
    import os

    schema_dir = f"{DATA_DIR}/schemas"
    data_dir   = f"{DATA_DIR}/data"

    validations = {
        "programmes.json":   "programme_schema.json",
        "personnel.json":    "personnel_schema.json",
        "announcements.json":"announcement_schema.json",
        "gallery.json":      "gallery_schema.json",
    }

    errors = []
    for data_file, schema_file in validations.items():
        data_path   = os.path.join(data_dir, data_file)
        schema_path = os.path.join(schema_dir, schema_file)

        if not os.path.exists(data_path) or not os.path.exists(schema_path):
            print(f"[SKIP] Missing: {data_file}")
            continue

        with open(data_path,   encoding="utf-8") as f: data   = json.load(f)
        with open(schema_path, encoding="utf-8") as f: schema = json.load(f)

        for i, record in enumerate(data):
            try:
                jsonschema.validate(instance=record, schema=schema)
            except jsonschema.ValidationError as ve:
                errors.append(f"{data_file}[{i}]: {ve.message}")

    if errors:
        print(f"[VALIDATION] ⚠️  {len(errors)} schema errors found:")
        for err in errors:
            print(f"  • {err}")
    else:
        print("[VALIDATION] ✅ All records pass schema validation")


def load_to_postgres(**kwargs):
    """Load validated JSON data into PostgreSQL."""
    import json
    import psycopg2
    import os

    conn = psycopg2.connect(
        host=os.getenv("PGHOST", "localhost"),
        port=os.getenv("PGPORT", 5432),
        dbname=os.getenv("PGDATABASE", "gri_db"),
        user=os.getenv("PGUSER", "gri_user"),
        password=os.getenv("PGPASSWORD", ""),
    )
    cur = conn.cursor()

    data_dir = f"{DATA_DIR}/data"

    # Load gallery data
    gallery_file = os.path.join(data_dir, "gallery.json")
    if os.path.exists(gallery_file):
        with open(gallery_file, encoding="utf-8") as f:
            gallery_records = json.load(f)
        for rec in gallery_records:
            cur.execute(
                """
                INSERT INTO gallery (id, filename, caption, event_date, remote_url, scraped_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (remote_url) DO UPDATE SET
                    caption    = EXCLUDED.caption,
                    scraped_at = EXCLUDED.scraped_at
                """,
                (rec["id"], rec["filename"], rec["caption"],
                 rec.get("event_date"), rec["remote_url"], rec["scraped_at"])
            )
        print(f"[DB] Loaded {len(gallery_records)} gallery records")

    # Load announcements
    ann_file = os.path.join(data_dir, "announcements.json")
    if os.path.exists(ann_file):
        with open(ann_file, encoding="utf-8") as f:
            ann_records = json.load(f)
        for rec in ann_records:
            cur.execute(
                """
                INSERT INTO announcements (id, type, title, body, published_at, source_url, scraped_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
                """,
                (rec["id"], rec["type"], rec["title"], rec.get("body", ""),
                 rec.get("published_at"), rec["source_url"], rec["scraped_at"])
            )
        print(f"[DB] Loaded {len(ann_records)} announcement records")

    conn.commit()
    cur.close()
    conn.close()
    print("[DB] ✅ PostgreSQL load complete")


def embed_to_vectordb(**kwargs):
    """Generate embeddings and load to ChromaDB for RAG pipeline."""
    import json
    import os
    try:
        import chromadb
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_community.embeddings import SentenceTransformerEmbeddings
    except ImportError:
        print("[VECTORDB] LangChain/ChromaDB not installed — skipping embed step")
        return

    client = chromadb.PersistentClient(path=f"{DATA_DIR}/vector_store")
    collection = client.get_or_create_collection("gri_knowledge_base")

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

    data_dir = f"{DATA_DIR}/data"
    files = ["announcements.json", "programmes.json"]

    for filename in files:
        path = os.path.join(data_dir, filename)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as f:
            records = json.load(f)

        for record in records:
            text = f"{record.get('title', '')} {record.get('body', '')} {record.get('name', '')}"
            chunks = splitter.split_text(text.strip())
            for i, chunk in enumerate(chunks):
                if chunk.strip():
                    emb = embeddings.embed_query(chunk)
                    collection.add(
                        documents=[chunk],
                        embeddings=[emb],
                        ids=[f"{record['id']}_{i}"],
                        metadatas=[{"source": record.get("source_url", ""), "type": filename}]
                    )

    print(f"[VECTORDB] ✅ Embeddings loaded into ChromaDB")


# ─────────────────────────────────────────────
# Airflow DAG Definition
# ─────────────────────────────────────────────

with DAG(
    dag_id="gri_etl_pipeline",
    default_args=DEFAULT_ARGS,
    description="GRI ruraluniv.ac.in — Daily Data Collection ETL Pipeline",
    schedule_interval="30 20 * * *",   # 02:00 IST = 20:30 UTC
    catchup=False,
    max_active_runs=1,
    tags=["gri", "etl", "web-scraping", "data-collection"],
) as dag:

    # ── Task Group 1: Static Crawl ──────────────────────────────
    with TaskGroup("crawl_static", tooltip="BeautifulSoup4 static scrapers") as tg_static:
        task_bs4 = PythonOperator(
            task_id="run_bs4_scraper",
            python_callable=run_bs4_scraper,
        )

        task_scrapy = BashOperator(
            task_id="run_scrapy_spider",
            bash_command=(
                f"cd {DATA_DIR} && scrapy crawl gri_spider "
                f"-O {DATA_DIR}/data/scrapy_output.json "
                "--logfile scrapy_run.log"
            ),
        )

    # ── Task Group 2: Dynamic Crawl ─────────────────────────────
    with TaskGroup("crawl_dynamic", tooltip="Playwright dynamic page scrapers") as tg_dynamic:
        task_pw = PythonOperator(
            task_id="run_playwright_scraper",
            python_callable=run_playwright_scraper,
        )

    # ── Task Group 3: Asset Downloads ───────────────────────────
    with TaskGroup("download_assets", tooltip="PDF and image downloader") as tg_download:
        task_pdfs = PythonOperator(
            task_id="download_pdfs",
            python_callable=download_pdfs,
        )

    # ── Task Group 4: Transform & Validate ──────────────────────
    with TaskGroup("transform_validate", tooltip="Schema validation") as tg_validate:
        task_validate = PythonOperator(
            task_id="validate_schemas",
            python_callable=validate_schemas,
        )

    # ── Task Group 5: Load ──────────────────────────────────────
    with TaskGroup("load", tooltip="Load to PostgreSQL and VectorDB") as tg_load:
        task_postgres = PythonOperator(
            task_id="load_to_postgres",
            python_callable=load_to_postgres,
        )
        task_vectordb = PythonOperator(
            task_id="embed_to_vectordb",
            python_callable=embed_to_vectordb,
        )
        task_postgres >> task_vectordb

    # ── Pipeline Execution Order ─────────────────────────────────
    [tg_static, tg_dynamic, tg_download] >> tg_validate >> tg_load
