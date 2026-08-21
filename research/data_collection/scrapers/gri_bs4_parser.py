"""
GRI BeautifulSoup4 Static Page Parser
Production scraper for https://ruraluniv.ac.in

Author  : Vijay Mahes
Version : 1.0.0
"""

import uuid
import json
import logging
import requests
from datetime import datetime, timezone
from bs4 import BeautifulSoup
from dataclasses import dataclass, asdict, field
from typing import Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

BASE_URL = "https://ruraluniv.ac.in"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)


# ─────────────────────────────────────────────
# Data Models
# ─────────────────────────────────────────────

@dataclass
class Department:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    slug: str = ""
    name: str = ""
    school: str = ""
    hod: str = ""
    email: str = ""
    phone: str = ""
    about: str = ""
    source_url: str = ""
    scraped_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class Programme:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    degree_type: str = ""     # UG, PG, M.Phil., Ph.D., Diploma, Certificate, B.Voc., ITEP
    department: str = ""
    duration_years: Optional[float] = None
    credits: Optional[int] = None
    intake: Optional[int] = None
    eligibility: str = ""
    syllabus_url: str = ""
    source_url: str = ""
    scraped_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class Personnel:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    designation: str = ""
    category: str = ""        # faculty | administration | governance
    department: str = ""
    qualification: str = ""
    specialization: str = ""
    email: str = ""
    phone: str = ""
    photo_url: str = ""
    source_url: str = ""
    scraped_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class Announcement:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    type: str = ""            # news | circular | notice | tender | event | result
    title: str = ""
    body: str = ""
    published_at: Optional[str] = None
    source_url: str = ""
    scraped_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class GalleryImage:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    filename: str = ""
    caption: str = ""
    event_date: Optional[str] = None
    remote_url: str = ""
    local_path: str = ""
    scraped_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ─────────────────────────────────────────────
# Utility Functions
# ─────────────────────────────────────────────

def fetch_page(url: str, timeout: int = 15) -> Optional[BeautifulSoup]:
    """Fetch a URL and return a BeautifulSoup object, or None on failure."""
    try:
        response = SESSION.get(url, timeout=timeout)
        response.raise_for_status()
        return BeautifulSoup(response.text, "html.parser")
    except requests.RequestException as exc:
        logger.error(f"[FETCH ERROR] {url} — {exc}")
        return None


def save_json(data: list, filename: str):
    """Serialize a list of dataclass instances to a JSON file."""
    output = [asdict(item) for item in data]
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    logger.info(f"[SAVED] {len(output)} records → {filename}")


def slugify(text: str) -> str:
    """Convert text to a URL-safe lowercase slug."""
    import re
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


# ─────────────────────────────────────────────
# Scraper: Programmes
# ─────────────────────────────────────────────

def scrape_programmes() -> list[Programme]:
    """Scrape academic programmes from the GRI academics page."""
    url = f"{BASE_URL}/academics?content=programmes"
    soup = fetch_page(url)
    if not soup:
        return []

    programmes = []

    # GRI uses <table> rows for programme listings
    tables = soup.find_all("table")
    for table in tables:
        rows = table.find_all("tr")
        for row in rows[1:]:   # Skip header row
            cols = [td.get_text(strip=True) for td in row.find_all("td")]
            if len(cols) >= 2:
                name = cols[0]
                degree_type = "UG" if "B." in name else ("PG" if "M." in name else "Ph.D." if "Ph.D" in name else "Diploma")
                prog = Programme(
                    name=name,
                    degree_type=degree_type,
                    department=cols[1] if len(cols) > 1 else "",
                    source_url=url,
                )
                programmes.append(prog)

    # Fallback: extract from list items if no tables found
    if not programmes:
        for li in soup.find_all("li"):
            text = li.get_text(strip=True)
            if len(text) > 5:
                programmes.append(Programme(name=text, source_url=url))

    logger.info(f"[PROGRAMMES] Found {len(programmes)} programmes")
    return programmes


# ─────────────────────────────────────────────
# Scraper: Administration Personnel (HODs, Deans, Officers)
# ─────────────────────────────────────────────

ADMIN_PAGES = {
    "chancellor":       ("administration?content=chancellor",   "governance"),
    "vc":               ("administration?content=vc",           "governance"),
    "registrar":        ("administration?content=registrar",    "administration"),
    "coe":              ("administration?content=coe",          "administration"),
    "financeofficer":   ("administration?content=financeofficer","administration"),
    "deans":            ("administration?content=deans",        "administration"),
    "hod":              ("administration?content=hod",          "administration"),
    "officers":         ("administration?content=officers",     "administration"),
}


def scrape_personnel() -> list[Personnel]:
    """Scrape all administration & governance personnel pages."""
    personnel_list = []

    for key, (path, category) in ADMIN_PAGES.items():
        url = f"{BASE_URL}/{path}"
        soup = fetch_page(url)
        if not soup:
            continue

        # Try table-based extraction first
        tables = soup.find_all("table")
        found = False
        for table in tables:
            rows = table.find_all("tr")
            for row in rows[1:]:
                cols = [td.get_text(strip=True) for td in row.find_all("td")]
                if len(cols) >= 2:
                    img_tag = row.find("img")
                    photo_url = ""
                    if img_tag and img_tag.get("src"):
                        src = img_tag["src"]
                        photo_url = src if src.startswith("http") else f"{BASE_URL}/{src.lstrip('/')}"

                    p = Personnel(
                        name=cols[0],
                        designation=cols[1] if len(cols) > 1 else key.replace("_", " ").title(),
                        category=category,
                        department=cols[2] if len(cols) > 2 else "",
                        email=cols[-1] if "@" in cols[-1] else "",
                        photo_url=photo_url,
                        source_url=url,
                    )
                    personnel_list.append(p)
                    found = True

        # Fallback: paragraph-based extraction
        if not found:
            name_tag = soup.find("h2") or soup.find("h3")
            name = name_tag.get_text(strip=True) if name_tag else ""
            if name:
                personnel_list.append(Personnel(
                    name=name,
                    designation=key.replace("_", " ").title(),
                    category=category,
                    source_url=url,
                ))

    logger.info(f"[PERSONNEL] Found {len(personnel_list)} personnel records")
    return personnel_list


# ─────────────────────────────────────────────
# Scraper: Gallery Images
# ─────────────────────────────────────────────

def scrape_gallery() -> list[GalleryImage]:
    """Extract gallery images listed on the GRI homepage."""
    url = f"{BASE_URL}/home.php"
    soup = fetch_page(url)
    if not soup:
        return []

    images = []
    # GRI homepage stores gallery slides as <div data-src="..."> elements
    gallery_divs = soup.find_all("div", attrs={"data-src": True})

    for div in gallery_divs:
        src = div.get("data-src", "")
        if not src:
            continue

        remote_url = src if src.startswith("http") else f"{BASE_URL}/{src.lstrip('/')}"
        filename = src.split("/")[-1]

        caption_tag = div.find("emp") or div.find("p")
        caption = caption_tag.get_text(strip=True) if caption_tag else ""

        # Try to parse date from filename like "20260731_1.jpg"
        event_date = None
        try:
            date_str = filename[:8]
            event_date = datetime.strptime(date_str, "%Y%m%d").date().isoformat()
        except ValueError:
            pass

        images.append(GalleryImage(
            filename=filename,
            caption=caption,
            event_date=event_date,
            remote_url=remote_url,
        ))

    logger.info(f"[GALLERY] Found {len(images)} gallery images")
    return images


# ─────────────────────────────────────────────
# Scraper: e-News / Announcements
# ─────────────────────────────────────────────

ENEWS_URLS = [
    f"{BASE_URL}/includes/enews/2k26",
    f"{BASE_URL}/includes/enews/2k25",
    f"{BASE_URL}/includes/enews/2k24",
    f"{BASE_URL}/includes/enews/2k23",
]


def scrape_announcements() -> list[Announcement]:
    """Scrape e-News and circular announcements."""
    announcements = []

    for url in ENEWS_URLS:
        soup = fetch_page(url)
        if not soup:
            continue

        for item in soup.find_all(["li", "div"], class_=lambda c: c and ("news" in c or "item" in c or "notice" in c)):
            link = item.find("a")
            title = item.get_text(strip=True)
            href = link.get("href", "") if link else ""
            full_url = href if href.startswith("http") else f"{BASE_URL}/{href.lstrip('/')}"

            if title:
                announcements.append(Announcement(
                    type="news",
                    title=title[:500],
                    source_url=full_url or url,
                ))

    logger.info(f"[ANNOUNCEMENTS] Found {len(announcements)} announcements")
    return announcements


# ─────────────────────────────────────────────
# Main Runner
# ─────────────────────────────────────────────

def run_all():
    """Run all scrapers and save JSON output files."""
    logger.info("═" * 50)
    logger.info("GRI Data Collection — BeautifulSoup4 Spider")
    logger.info("═" * 50)

    programmes  = scrape_programmes()
    personnel   = scrape_personnel()
    gallery     = scrape_gallery()
    news        = scrape_announcements()

    save_json(programmes, "research/data_collection/data/programmes.json")
    save_json(personnel,  "research/data_collection/data/personnel.json")
    save_json(gallery,    "research/data_collection/data/gallery.json")
    save_json(news,       "research/data_collection/data/announcements.json")

    logger.info("✅ All scrapers completed.")


if __name__ == "__main__":
    run_all()
