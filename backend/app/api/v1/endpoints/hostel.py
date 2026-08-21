import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone

router = APIRouter()

class OutPassCreate(BaseModel):
    type: str
    startDate: str
    endDate: str
    reason: str

@router.get("/outpass", response_model=dict)
async def get_outpass_list():
    outpasses = [
        {
            "id": "OPT-8841-01",
            "type": "WEEKEND LEAVE",
            "startDate": "2026-05-10T06:00:00Z",
            "endDate": "2026-05-12T20:00:00Z",
            "reason": "Family visit",
            "status": "PARENT_APPROVED",
            "warden": "APPROVED"
        },
        {
            "id": "OPT-8841-02",
            "type": "LOCAL PASS",
            "startDate": "2026-05-04T16:00:00Z",
            "endDate": "2026-05-04T20:00:00Z",
            "reason": "Personal work in Dindigul",
            "status": "COMPLETED",
            "warden": "APPROVED"
        }
    ]
    return {
        "success": True,
        "statusCode": 200,
        "message": "Out-Pass list retrieved successfully",
        "data": outpasses
    }

@router.post("/outpass", response_model=dict)
async def create_outpass(payload: OutPassCreate):
    new_id = f"OPT-{int(time.time() * 1000)}"
    return {
        "success": True,
        "statusCode": 201,
        "message": "Out-Pass request created. Parent SMS OTP notification sent.",
        "data": {
            "id": new_id,
            "status": "PENDING_PARENT",
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
    }
