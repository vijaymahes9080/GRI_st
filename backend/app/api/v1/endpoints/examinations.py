from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ExamResult(BaseModel):
    code: str
    title: str
    grade: str
    credits: int
    points: float

@router.get("/results", response_model=dict)
async def get_exam_results(semester: int = Query(default=3, ge=1, le=8)):
    results = [
        {"code": "CS-301", "title": "Data Structures & Algorithms", "grade": "A+", "credits": 4, "points": 10.0},
        {"code": "CS-302", "title": "Database Management Systems", "grade": "A", "credits": 4, "points": 9.0},
        {"code": "CS-303", "title": "Computer Networks", "grade": "A+", "credits": 3, "points": 10.0},
        {"code": "CS-304", "title": "Operating Systems", "grade": "B+", "credits": 4, "points": 8.0},
    ]
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Results retrieved for semester {semester}",
        "data": results,
        "meta": {
            "cgpa": 8.85,
            "classification": "FIRST CLASS WITH DISTINCTION"
        }
    }
