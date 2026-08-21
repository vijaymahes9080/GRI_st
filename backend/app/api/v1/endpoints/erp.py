import hmac
import hashlib
import json

from fastapi import APIRouter, Query, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

from backend.app.core.config import settings
from backend.app.erp.erp_middleware import erp_engine

router = APIRouter()


class WebhookEvent(BaseModel):
    event_type: str = Field(..., max_length=100)
    payload: Dict[str, Any]


def _verify_webhook_signature(request: Request) -> bool:
    """HMAC-SHA256 signature check over the raw body using ERP_WEBHOOK_SECRET.

    Fails closed: when no secret is configured the webhook is rejected so a
    missing secret can never silently allow spoofed events.
    """
    secret = settings.ERP_WEBHOOK_SECRET
    if not secret:
        return False

    signature = request.headers.get("x-erp-signature", "")
    raw_body = request.state.raw_body if hasattr(request.state, "raw_body") else ""

    expected = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected)


@router.get("/sync/{roll_number}", response_model=dict)
async def sync_student_full(roll_number: str):
    if not roll_number.strip():
        raise HTTPException(status_code=400, detail="roll_number must not be empty")
    data = await erp_engine.sync_student_data(roll_number)
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Full ERP synchronization completed for roll number {roll_number}",
        "data": data
    }


@router.get("/sync/{roll_number}/attendance", response_model=dict)
async def sync_student_attendance(roll_number: str):
    if not roll_number.strip():
        raise HTTPException(status_code=400, detail="roll_number must not be empty")
    data = await erp_engine.sync_attendance(roll_number)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Attendance records synchronized from ERP SOAP endpoint",
        "data": data
    }


@router.get("/sync/{roll_number}/results", response_model=dict)
async def sync_student_results(roll_number: str, semester: int = Query(default=3)):
    if not roll_number.strip():
        raise HTTPException(status_code=400, detail="roll_number must not be empty")
    if not 1 <= semester <= 12:
        raise HTTPException(status_code=400, detail="semester must be between 1 and 12")
    data = await erp_engine.sync_exam_results(roll_number, semester)
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Semester {semester} results synchronized from legacy database",
        "data": data
    }


@router.get("/sync/assignments/{course_code}", response_model=dict)
async def sync_assignments(course_code: str):
    if not course_code.strip():
        raise HTTPException(status_code=400, detail="course_code must not be empty")
    data = await erp_engine.sync_assignments(course_code)
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Assignments synchronized for {course_code}",
        "data": data
    }


@router.post("/webhook", response_model=dict)
async def handle_erp_webhook(request: Request, event: WebhookEvent, background_tasks: BackgroundTasks):
    # Capture the raw body before FastAPI consumes the stream for signature checks.
    request.state.raw_body = (await request.body()).decode("utf-8")

    if not _verify_webhook_signature(request):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    result = await erp_engine.handle_incoming_webhook(event.event_type, event.payload)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Webhook received",
        "data": result
    }
