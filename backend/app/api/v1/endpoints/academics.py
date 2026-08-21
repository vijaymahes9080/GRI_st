from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class ScheduleItem(BaseModel):
    code: str
    name: str
    time: str
    faculty: str
    status: str

class BleAttendanceRequest(BaseModel):
    beaconId: str
    courseCode: str
    geoLat: Optional[float] = None
    geoLong: Optional[float] = None

@router.get("/timetable", response_model=dict)
async def get_timetable():
    schedule = [
        {"code": "CS-401", "name": "Mobile Application Architecture", "time": "09:30 AM - 10:30 AM", "faculty": "Dr. R. Ramanathan", "status": "PRESENT"},
        {"code": "CS-402", "name": "Distributed Cloud Systems", "time": "10:30 AM - 11:30 AM", "faculty": "Dr. S. Meenakshi", "status": "PRESENT"},
        {"code": "CS-403", "name": "Deep Learning & Vector RAG", "time": "11:45 AM - 12:45 PM", "faculty": "Dr. K. Swaminathan", "status": "UPCOMING"},
        {"code": "CS-404", "name": "Software Project Management", "time": "02:00 PM - 03:00 PM", "faculty": "Dr. V. Rajesh", "status": "UPCOMING"},
    ]
    return {
        "success": True,
        "statusCode": 200,
        "message": "Timetable fetched successfully",
        "data": schedule
    }

@router.post("/attendance/ble", response_model=dict)
async def mark_ble_attendance(request: BleAttendanceRequest):
    if not request.beaconId:
        raise HTTPException(status_code=400, detail="Beacon ID is required")
    
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Attendance marked for course {request.courseCode} via beacon {request.beaconId}",
        "data": {
            "timestamp": datetime.utcnow().isoformat(),
            "status": "VERIFIED"
        }
    }
