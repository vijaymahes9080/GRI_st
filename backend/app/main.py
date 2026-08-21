from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.api.v1.endpoints import (
    auth,
    admin_users,
    oauth,
    rag,
    erp,
    notifications,
    students,
    files,
    academics,
    examinations,
    hostel,
    ai_analytics,
    websockets,
    website_sync,
    statutory,
    extension_cells,
    public,
    contracts,
    admin_notifications,
    cms,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",            # Swagger UI
    redoc_url="/redoc",          # ReDoc UI
)

from backend.app.core.security_middleware import SecurityHeadersMiddleware, RateLimiterWAFMiddleware

# Add Security & WAF Rate Limiter Middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimiterWAFMiddleware, max_requests=100, window_seconds=60)

# CORS Middleware — origins come from validated settings (never "*" with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["http://localhost:8081"],
    allow_credentials=bool(settings.CORS_ORIGINS and "*" not in settings.CORS_ORIGINS),
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from prometheus_fastapi_instrumentator import Instrumentator
    Instrumentator().instrument(app).expose(app)
except ImportError:
    pass

# Include Routers
app.include_router(auth.router,        prefix=f"{settings.API_V1_STR}/auth",  tags=["Authentication"])
app.include_router(admin_users.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin — User Management"])
app.include_router(oauth.router,       prefix=f"{settings.API_V1_STR}/oauth", tags=["OAuth, OTP & MFA"])
app.include_router(academics.router, prefix=f"{settings.API_V1_STR}/academics", tags=["Academics & Attendance"])
app.include_router(examinations.router, prefix=f"{settings.API_V1_STR}/examinations", tags=["Examinations & Results"])
app.include_router(hostel.router, prefix=f"{settings.API_V1_STR}/hostel", tags=["Hostel & Outpass"])
app.include_router(rag.router, prefix=f"{settings.API_V1_STR}/rag", tags=["AI Chatbot & RAG Engine"])
app.include_router(ai_analytics.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Analytics & Predictions"])
app.include_router(erp.router, prefix=f"{settings.API_V1_STR}/erp", tags=["ERP Middleware & Webhooks"])
app.include_router(website_sync.router, prefix=f"{settings.API_V1_STR}/website", tags=["Live Website Sync (ruraluniv.ac.in)"])
app.include_router(notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notifications & Alerts"])
app.include_router(admin_notifications.router, prefix=f"{settings.API_V1_STR}/admin/notifications", tags=["Admin Notifications Control"])
app.include_router(cms.router, prefix=f"{settings.API_V1_STR}/cms", tags=["Dynamic Content Management"])
app.include_router(students.router, prefix=f"{settings.API_V1_STR}/students", tags=["Students"])
app.include_router(files.router, prefix=f"{settings.API_V1_STR}/files", tags=["Files & Parsing"])
app.include_router(statutory.router, prefix=f"{settings.API_V1_STR}/statutory", tags=["Statutory Bodies & Regulations"])
app.include_router(extension_cells.router, prefix=f"{settings.API_V1_STR}/extension", tags=["Extension, Outreach & Cells"])
app.include_router(public.router, prefix=f"{settings.API_V1_STR}/public", tags=["Public Portal & Research Integrations"])
app.include_router(contracts.router, prefix=f"{settings.API_V1_STR}", tags=["Mobile App Contracts"])
app.include_router(websockets.router, prefix="", tags=["Real-time WebSockets"])

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }
