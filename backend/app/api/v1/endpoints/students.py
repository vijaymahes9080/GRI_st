from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List

router = APIRouter()

class StudentSchema(BaseModel):
    id: str
    roll_number: str
    first_name: str
    last_name: str
    department: str
    cgpa: float

class PaginatedStudentResponse(BaseModel):
    total: int
    page: int
    size: int
    items: List[StudentSchema]

@router.get("", response_model=PaginatedStudentResponse)
async def list_students(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    department: str = Query(None),
):
    # Mock paginated data response
    mock_students = [
        StudentSchema(
            id="1",
            roll_number="21301001",
            first_name="Vijay",
            last_name="Mahes",
            department="Computer Science",
            cgpa=8.92,
        ),
        StudentSchema(
            id="2",
            roll_number="21301002",
            first_name="Anitha",
            last_name="Ramesh",
            department="Agriculture",
            cgpa=9.14,
        ),
    ]
    return PaginatedStudentResponse(
        total=len(mock_students),
        page=page,
        size=size,
        items=mock_students,
    )
