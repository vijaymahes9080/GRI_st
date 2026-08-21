from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from backend.app.ai.predictions import prediction_engine
from backend.app.ai.rag_pipeline import rag_engine

router = APIRouter()

class AttendancePredictRequest(BaseModel):
    currentAttendance: float
    totalClassesLeft: int = 15
    classesHeld: Optional[int] = None

class CgpaTargetRequest(BaseModel):
    currentCgpa: float
    targetCgpa: float
    completedSemesters: int = 3
    totalSemesters: int = 8

@router.post("/predict/attendance", response_model=dict)
async def predict_attendance(req: AttendancePredictRequest):
    result = prediction_engine.predict_attendance_risk(
        req.currentAttendance,
        req.totalClassesLeft,
        classes_held=req.classesHeld,
    )
    return {
        "success": True,
        "statusCode": 200,
        "message": "Attendance risk prediction complete",
        "data": result
    }

@router.post("/predict/cgpa", response_model=dict)
async def predict_cgpa(req: CgpaTargetRequest):
    result = prediction_engine.predict_cgpa_target(
        req.currentCgpa, req.targetCgpa, req.totalSemesters, req.completedSemesters
    )
    return {
        "success": True,
        "statusCode": 200,
        "message": "CGPA target estimation complete",
        "data": result
    }

@router.get("/recommendations/courses", response_model=dict)
async def get_course_recommendations(department: str = "Computer Science", semester: int = 4):
    recs = prediction_engine.recommend_courses(department, semester)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Course recommendations generated",
        "data": recs
    }

@router.get("/semantic-search", response_model=dict)
async def semantic_search(query: str = Query(..., min_length=2)):
    rag_res = await rag_engine.query(query, domain="search")
    return {
        "success": True,
        "statusCode": 200,
        "message": "Semantic search completed",
        "data": {
            "query": query,
            "results": [
                {
                    "title": "GRI Examination Ordinance 2025",
                    "snippet": rag_res["answer"],
                    "citations": rag_res["citations"],
                    "similarityScore": rag_res["confidence_score"]
                }
            ]
        }
    }
