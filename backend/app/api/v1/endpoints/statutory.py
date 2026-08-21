"""
GRI Statutory Bodies, Governance Disclosures & Conduct API Endpoint
Covers: Deemed University Regulations 2023, UGC 2010 Rules, Codes of Conduct, RTI Officers, Ombudsperson
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

class StatutoryInfoResponse(BaseModel):
    institution: str
    motto: str
    accreditation: str
    ministry: str
    regulations: List[Dict[str, str]]
    codes_of_conduct: List[Dict[str, str]]
    rti_officers: List[Dict[str, str]]
    ombudsperson: Dict[str, str]

@router.get("/info", response_model=dict)
async def get_statutory_information():
    return {
        "success": True,
        "statusCode": 200,
        "message": "Statutory information and governance disclosures fetched successfully",
        "data": {
            "institution": "The Gandhigram Rural Institute (Deemed to be University)",
            "motto": "கிராமம் உயர நாடு உயரும் (As villages rise, the nation rises)",
            "accreditation": "Accredited by NAAC with 'A++' Grade (4th Cycle)",
            "ministry": "Ministry of Education (Shiksha Mantralaya), Government of India",
            "regulations": [
                {"title": "Deemed to be University Regulations 2023", "pdfUrl": "https://ruraluniv.ac.in/includes/regulations/2023.pdf"},
                {"title": "UGC Regulations on Minimum Eligibility 2010", "pdfUrl": "https://ruraluniv.ac.in/includes/regulations/ugc2010.pdf"},
                {"title": "CCS (Conduct) Rules", "pdfUrl": "https://ruraluniv.ac.in/includes/regulations/ccs.pdf"},
            ],
            "codes_of_conduct": [
                {"category": "Teaching Staff", "title": "Code of Ethics and Professional Standards for Faculty", "url": "https://ruraluniv.ac.in/coc_teaching"},
                {"category": "Non-Teaching Staff", "title": "Administrative Staff Code of Conduct and Service Rules", "url": "https://ruraluniv.ac.in/coc_staff"},
                {"category": "Students", "title": "GRI Student Code of Conduct & Vehicle Ban Guidelines", "url": "https://ruraluniv.ac.in/coc_students"},
            ],
            "rti_officers": [
                {"role": "First Appellate Authority", "name": "Registrar, GRI", "contact": "registrar@ruraluniv.ac.in"},
                {"role": "Public Information Officer (PIO)", "name": "Deputy Registrar (Admin)", "contact": "pio@ruraluniv.ac.in"},
            ],
            "ombudsperson": {
                "name": "Dr. S. K. Subramanian",
                "role": "Student Grievance Redressal Ombudsperson",
                "portal": "https://e-samadhan.ugc.ac.in",
                "email": "ombudsperson@ruraluniv.ac.in"
            },
            "vehicle_policy": "Ban on the use of motorized two-wheelers and four-wheelers by hostel students inside the campus."
        }
    }
