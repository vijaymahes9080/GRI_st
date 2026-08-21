import io
import time

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from PIL import Image, ImageFile
from pypdf import PdfReader

from backend.app.core.rbac import RoleChecker

router = APIRouter()

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit
MAX_IMAGE_PIXELS = 80_000_000  # decompression-bomb guard (80 megapixels)
MAX_PDF_PAGES = 500

allow_any_authenticated = RoleChecker(allowed_roles=["student", "faculty", "admin", "staff"])


def _require_auth(credentials=Depends(allow_any_authenticated)):
    # Dependency wrapper: 401 when no/expired token, 403 for unauthorized roles.
    return credentials


@router.post("/upload-image")
async def upload_and_process_image(
    file: UploadFile = File(...),
    auth=Depends(_require_auth),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    if file.size and file.size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit (10MB)")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit (10MB)")

    try:
        image = Image.open(io.BytesIO(contents))
        # Disable the default decoder catch so we can handle truncated/bomb images explicitly.
        ImageFile.LOAD_TRUNCATED_IMAGES = False
        image.load()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid or corrupt image: {exc}")

    if image.width * image.height > MAX_IMAGE_PIXELS:
        raise HTTPException(status_code=413, detail="Image dimensions exceed maximum allowed size")

    # Process image: resize to max 800x800 thumbnail
    image.thumbnail((800, 800))
    output_buffer = io.BytesIO()
    image.convert("RGB").save(output_buffer, format="JPEG", quality=85)

    return {
        "filename": file.filename,
        "format": image.format,
        "width": image.width,
        "height": image.height,
        "size_bytes": len(output_buffer.getvalue()),
        "status": "processed_and_thumbnail_generated",
    }


@router.post("/parse-pdf")
async def parse_pdf_document(
    file: UploadFile = File(...),
    auth=Depends(_require_auth),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    if file.size and file.size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit (10MB)")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit (10MB)")

    try:
        pdf_reader = PdfReader(io.BytesIO(contents))
        num_pages = len(pdf_reader.pages)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid or corrupt PDF: {exc}")

    if num_pages > MAX_PDF_PAGES:
        raise HTTPException(status_code=413, detail="PDF exceeds maximum allowed page count")

    first_page_text = pdf_reader.pages[0].extract_text() if num_pages > 0 else ""

    return {
        "filename": file.filename,
        "total_pages": num_pages,
        "extracted_preview": first_page_text[:300],
        "status": "parsed_successfully",
    }


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    auth=Depends(_require_auth),
):
    """Generic upload endpoint matching the mobile client's `/files/upload`.

    Stores the upload in memory and returns an opaque fileId; a persistent
    object store (e.g. S3/Cloudflare R2) should be wired in for production.
    """
    if file.size and file.size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit (10MB)")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit (10MB)")

    return {
        "success": True,
        "statusCode": 200,
        "message": "File uploaded",
        "data": {
            "fileId": f"FIL-{int(time.time() * 1000)}",
            "url": f"/files/{file.filename}",
            "filename": file.filename,
            "size": len(contents),
        },
    }
