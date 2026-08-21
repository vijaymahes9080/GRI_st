import time
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from backend.app.core.config import settings

router = APIRouter()


# ---------------------------------------------------------------------------
# /app/config — server-driven app configuration consumed by useAppConfig.ts
# ---------------------------------------------------------------------------
FEATURES = {
    "admissions": True,
    "admissions_2026": True,
    "examinations": True,
    "results": True,
    "departments": True,
    "faculty": True,
    "news": True,
    "events": True,
    "downloads": True,
    "library": True,
    "student_services": True,
    "grievance": True,
    "placement": True,
    "hostel": True,
    "transport": True,
    "uba_extension": True,
    "kvk_advisories": True,
    "statutory_governance": True,
    "research_rdc": True,
    "flagship_schemes": True,
}

NAVIGATION = [
    {"id": "home", "title": "Home", "icon": "home", "route": "/(tabs)/home", "order": 1, "enabled": True},
    {"id": "academics", "title": "Academics", "icon": "book-open", "route": "/(tabs)/academics", "featureFlagKey": "departments", "order": 2, "enabled": True},
    {"id": "services", "title": "Services", "icon": "layers", "route": "/(tabs)/services", "featureFlagKey": "student_services", "order": 3, "enabled": True},
    {"id": "discover", "title": "Discover", "icon": "compass", "route": "/(tabs)/discover", "order": 4, "enabled": True},
    {"id": "ai_chat", "title": "AI Assistant", "icon": "bot", "route": "/(tabs)/ai_chat", "order": 5, "enabled": True},
    {"id": "profile", "title": "Profile", "icon": "user", "route": "/(tabs)/profile", "order": 6, "enabled": True},
]


@router.get("/app/config")
async def get_app_config():
    return {
        "success": True,
        "statusCode": 200,
        "message": "App configuration retrieved",
        "data": {
            "appVersion": settings.VERSION,
            "minimumVersion": "1.0.0",
            "recommendedVersion": "1.0.0",
            "maintenanceMode": False,
            "maintenanceMessage": None,
            "features": FEATURES,
            "navigation": NAVIGATION,
            "theme": {
                "primaryColor": "#518214",
                "secondaryColor": "#911C03",
                "accentColor": "#F16236",
                "surfaceColor": "#FFFFFF",
                "darkSurfaceColor": "#121212",
            },
        },
    }


# ---------------------------------------------------------------------------
# /transport — GPS tracking consumed by useTransport.ts
# ---------------------------------------------------------------------------
_ROUTE_COORDS = {
    "01": (10.3800, 77.9650),
    "02": (10.3750, 77.9600),
    "03": (10.3700, 77.9550),
}


@router.get("/transport/gps/{bus_no}")
async def get_bus_gps(bus_no: str):
    base = _ROUTE_COORDS.get(bus_no.strip(), (10.3800, 77.9650))
    drift = (time.time() % 60) / 60.0
    return {
        "success": True,
        "statusCode": 200,
        "message": f"GPS location for bus {bus_no}",
        "data": {
            "busNo": bus_no,
            "routeNo": f"R-{bus_no}",
            "lat": round(base[0] + drift * 0.001, 6),
            "long": round(base[1] + drift * 0.001, 6),
            "speed": round(30 + (time.time() % 20), 1),
            "nextStop": "Library Junction",
            "etaMinutes": 8,
        },
    }


# ---------------------------------------------------------------------------
# /complaints — grievance tickets consumed by useComplaints.ts
# ---------------------------------------------------------------------------
class ComplaintCreateRequest(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=2000)
    priority: str = Field(default="NORMAL", pattern="^(NORMAL|HIGH|CRITICAL)$")


_complaints_store: List[Dict[str, Any]] = []


@router.get("/complaints/tickets")
async def list_grievance_tickets(status_filter: Optional[str] = Query(default=None)):
    tickets = _complaints_store
    if status_filter:
        tickets = [t for t in tickets if t["status"] == status_filter.upper()]
    return {
        "success": True,
        "statusCode": 200,
        "message": "Grievance tickets retrieved",
        "data": tickets,
    }


@router.post("/complaints/tickets")
async def create_grievance_ticket(request: ComplaintCreateRequest):
    created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    ticket = {
        "ticketId": f"TCK-{int(time.time() * 1000)}",
        "category": request.category,
        "description": request.description,
        "status": "OPEN",
        "priority": request.priority.upper(),
        "createdAt": created_at,
        "slaExpiresAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + 86400)),
    }
    _complaints_store.append(ticket)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Grievance ticket created",
        "data": ticket,
    }


# ---------------------------------------------------------------------------
# /outreach — village surveys consumed by useOutreach.ts
# ---------------------------------------------------------------------------
class SurveyRequest(BaseModel):
    village: str = Field(..., min_length=1, max_length=200)
    surveyType: str = Field(..., min_length=1, max_length=100)
    householdData: Dict[str, Any] = Field(default_factory=dict)
    geoLat: float
    geoLong: float
    imageUri: Optional[str] = None


@router.post("/outreach/surveys")
async def submit_survey(request: SurveyRequest):
    return {
        "success": True,
        "statusCode": 200,
        "message": f"Survey for {request.village} recorded",
        "data": {
            "surveyId": f"SUR-{int(time.time() * 1000)}",
            "village": request.village,
            "surveyType": request.surveyType,
            "status": "RECORDED",
        },
    }


# ---------------------------------------------------------------------------
# /library — OPAC search consumed by useLibrary.ts
# ---------------------------------------------------------------------------
_CATALOG = [
    {"id": "BK-001", "title": "The Practice of Social Research", "author": "Earl Babbie", "callNo": "300.72 BAB", "status": "AVAILABLE", "rack": "A3"},
    {"id": "BK-002", "title": "Rural Development in India", "author": "Katar Singh", "callNo": "307.1412 SIN", "status": "ISSUED", "rack": "B1"},
    {"id": "BK-003", "title": "Principles of Microeconomics", "author": "N. Gregory Mankiw", "callNo": "338.5 MAN", "status": "AVAILABLE", "rack": "C2"},
]


@router.get("/library/search")
async def opac_search(q: str = Query(..., min_length=2), page: int = Query(default=1, ge=1)):
    term = q.strip().lower()
    matches = [
        b for b in _CATALOG
        if term in b["title"].lower() or term in b["author"].lower()
    ]
    page_size = 10
    start = (page - 1) * page_size
    return {
        "success": True,
        "statusCode": 200,
        "message": "Library search completed",
        "data": {
            "items": matches[start:start + page_size],
            "total": len(matches),
        },
    }
