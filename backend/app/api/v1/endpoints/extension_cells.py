"""
GRI Rural Extension, Flagship Schemes & Cells API Endpoint
Covers: Unnat Bharat Abhiyan (UBA), KVK, IQAC, IPRC, DDU-KK, MMTTC, Viksit Bharat @2047, Placement Cell
"""

from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

@router.get("/cells", response_model=dict)
async def get_institutional_cells():
    return {
        "success": True,
        "statusCode": 200,
        "message": "GRI Institutional Cells directory fetched",
        "data": [
            {"code": "IQAC", "name": "Internal Quality Assurance Cell", "coordinator": "Dr. P. Shanmugam", "status": "ACTIVE"},
            {"code": "IPRC", "name": "Intellectual Property Rights Cell", "coordinator": "Dr. M. Ganesan", "status": "ACTIVE"},
            {"code": "UBA", "name": "Unnat Bharat Abhiyan (Regional Coordinating Institute)", "coordinator": "Dr. T. Kalaiselvan", "status": "ACTIVE"},
            {"code": "KVK", "name": "Krishi Vigyan Kendra (Agricultural Science Centre)", "head": "Dr. V. Sundaram", "status": "ACTIVE"},
            {"code": "DDU-KK", "name": "Deen Dayal Upadhyaya Kaushal Kendra", "coordinator": "Dr. K. Ganesan", "status": "ACTIVE"},
            {"code": "MMTTC", "name": "Malaviya Mission Teacher Training Centre", "director": "Dr. S. Meenakshi", "status": "ACTIVE"},
            {"code": "PLACEMENT", "name": "Centre for Training & Placement", "officer": "Dr. R. Ramanathan", "status": "ACTIVE"},
            {"code": "CED", "name": "Centre for Entrepreneurship Development", "director": "Dr. N. Kannan", "status": "ACTIVE"},
        ]
    }

@router.get("/uba/villages", response_model=dict)
async def get_uba_adopted_villages():
    return {
        "success": True,
        "statusCode": 200,
        "message": "Unnat Bharat Abhiyan adopted villages and project status fetched",
        "data": [
            {"village": "Ambathurai", "block": "Reddiarchatiram", "district": "Dindigul", "projects": ["Solar Water Pump", "Organic Farming Awareness", "Digital Literacy Camp"]},
            {"village": "Chinnalapatti", "block": "Reddiarchatiram", "district": "Dindigul", "projects": ["Handloom Weavers Skill Upgrade", "Waste Management"]},
            {"village": "Sirumalai", "block": "Dindigul", "district": "Dindigul", "projects": ["Eco-Tourism", "Medicinal Plant Cultivation"]},
        ]
    }
