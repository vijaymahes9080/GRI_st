from fastapi import APIRouter
from backend.app.services.website_sync_service import website_sync_service

router = APIRouter()

@router.get("/circulars", response_model=dict)
async def get_live_circulars():
    data = await website_sync_service.fetch_latest_circulars()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Live circulars fetched from ruraluniv.ac.in",
        "data": data
    }

@router.get("/events", response_model=dict)
async def get_live_events():
    data = await website_sync_service.fetch_latest_events()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Live events and conferences fetched",
        "data": data
    }

@router.get("/tenders", response_model=dict)
async def get_live_tenders():
    data = await website_sync_service.fetch_latest_tenders()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Live tenders and RFPs fetched",
        "data": data
    }

@router.get("/careers", response_model=dict)
async def get_live_careers():
    data = await website_sync_service.fetch_latest_careers()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Live career notifications and recruitment openings fetched",
        "data": data
    }

@router.get("/student-corner", response_model=dict)
async def get_student_corner():
    data = await website_sync_service.fetch_student_corner_services()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Student Corner services taxonomy fetched",
        "data": data
    }

@router.get("/navigation", response_model=dict)
async def get_official_navigation():
    data = await website_sync_service.fetch_official_website_navigation()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Official website menu hierarchy fetched",
        "data": data
    }

@router.get("/portals", response_model=dict)
async def get_official_portals():
    data = await website_sync_service.fetch_official_portals()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Connected GRI web portals fetched",
        "data": data
    }

@router.get("/governance", response_model=dict)
async def get_governance_structure():
    data = await website_sync_service.fetch_governance_structure()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Official GRI governance structure fetched",
        "data": data
    }

@router.get("/schools-and-centres", response_model=dict)
async def get_schools_and_centres():
    data = await website_sync_service.fetch_academic_schools_and_centres()
    return {
        "success": True,
        "statusCode": 200,
        "message": "GRI Schools, Departments, and Centres directory fetched",
        "data": data
    }

@router.get("/facilities", response_model=dict)
async def get_campus_facilities():
    data = await website_sync_service.fetch_campus_facilities_directory()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Campus facilities and research infrastructure directory fetched",
        "data": data
    }

@router.get("/live-home", response_model=dict)
async def get_live_home_highlights():
    data = await website_sync_service.fetch_live_home_data()
    return {
        "success": True,
        "statusCode": 200,
        "message": "Live website homepage highlights fetched",
        "data": data
    }


