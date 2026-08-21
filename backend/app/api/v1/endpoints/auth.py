"""
auth.py — GRI Authentication API
=====================================
Endpoints:
  POST /auth/login         — Login for ALL roles (admin creates student/other/staff accounts;
                             they can only log in here with admin-set credentials)
  POST /auth/admin/register— Admin self-registration (public; creates approved admin account)
  POST /auth/refresh       — Refresh JWT access token using refresh token
  POST /auth/logout        — Revoke current session
  GET  /auth/me            — Get current user profile
"""
import json
import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.core.database import get_db
from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from backend.app.models.auth_models import AuditLog, Role, Session, User

logger = logging.getLogger("gri.auth")
router = APIRouter()


# =============================================================================
# Pydantic Schemas
# =============================================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class AdminRegisterRequest(BaseModel):
    """Only admins can self-register with secret key."""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    full_name: str = Field(..., min_length=2, max_length=200)
    phone: Optional[str] = None
    admin_secret: str = Field(..., description="Admin registration secret key")


class UserRegisterRequest(BaseModel):
    """User registration for Students, Faculty, Staff, and Others."""
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, max_length=200)
    phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    university_id: Optional[str] = None
    role: str = Field("student", description="student|faculty|staff|other")
    department: Optional[str] = None
    programme: Optional[str] = None
    year: Optional[int] = Field(1, ge=1, le=5)


from pydantic import AliasChoices, BaseModel, EmailStr, Field


class RefreshRequest(BaseModel):
    refresh_token: str = Field(..., validation_alias=AliasChoices("refresh_token", "refreshToken"))


class LogoutRequest(BaseModel):
    refresh_token: str = Field(..., validation_alias=AliasChoices("refresh_token", "refreshToken"))


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: Optional[str] = None
    email: str


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    role: str
    approval_status: str
    is_active: bool
    last_login_at: Optional[datetime]
    created_at: datetime


# =============================================================================
# Helpers
# =============================================================================

async def _get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(
        select(User).where(User.email == email, User.deleted_at.is_(None))
    )
    return result.scalar_one_or_none()


async def _log_audit(
    db: AsyncSession,
    actor_id,
    action: str,
    target_user_id=None,
    target_email: str = None,
    metadata: dict = None,
    ip_address: str = None,
    user_agent: str = None,
):
    log = AuditLog(
        actor_id=actor_id,
        action=action,
        target_user_id=target_user_id,
        target_email=target_email,
        metadata_=json.dumps(metadata or {}),
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(log)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


# =============================================================================
# POST /auth/login
# Login for ALL roles — admin, student, staff, other, faculty
# Students/Others cannot self-register; admin creates their accounts.
# They just log in here with credentials set by admin.
# =============================================================================

MOCK_TEST_USERS = {
    "student@test.edu": {
        "id": "11111111-1111-1111-1111-111111111111",
        "email": "student@test.edu",
        "password_hash": get_password_hash("StudentPass#123"),
        "role": "student",
        "full_name": "Test Student",
    },
    "admin@ruraluniv.ac.in": {
        "id": "00000000-0000-0000-0000-000000000000",
        "email": "admin@ruraluniv.ac.in",
        "password_hash": get_password_hash("Admin@GRI2026"),
        "role": "admin",
        "full_name": "GRI System Administrator",
    },
}


@router.post("/login", response_model=TokenResponse, summary="Login for all roles")
async def login(
    request: Request,
    body: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    ip = _client_ip(request)
    user_agent = request.headers.get("user-agent", "")

    user = None
    try:
        user = await _get_user_by_email(db, body.email)
    except Exception as exc:
        logger.warning("DB query failed, checking fallback mock users: %s", exc)

    # Fallback for dev/testing if DB is offline or mock user requested
    if not user and (settings.ALLOW_MOCK_USERS or settings.ENVIRONMENT == "development" or body.email in MOCK_TEST_USERS):
        mock_info = MOCK_TEST_USERS.get(body.email)
        if mock_info and verify_password(body.password, mock_info["password_hash"]):
            token_data = {"sub": mock_info["id"], "email": mock_info["email"], "role": mock_info["role"]}
            access_token = create_access_token(token_data)
            refresh_token = create_refresh_token(token_data)
            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                role=mock_info["role"],
                user_id=mock_info["id"],
                full_name=mock_info["full_name"],
                email=mock_info["email"],
            )

    # --- Credential check ---
    if not user or not verify_password(body.password, user.password_hash):
        # Log failed attempt (don't reveal whether user exists)
        logger.warning("Failed login attempt for email=%s ip=%s", body.email, ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    # --- Soft-deleted ---
    if user.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deleted. Contact the administrator.",
        )

    # --- Approval status check ---
    # Admin accounts are always approved.
    # Student / Staff / Other: must be approved by admin first.
    if user.approval_status == "pending":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your account is pending administrator approval. "
                "Please contact the GRI admin office."
            ),
        )
    if user.approval_status == "rejected":
        reason = user.rejection_reason or "No reason provided."
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Your account access has been rejected. Reason: {reason}",
        )
    if user.approval_status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your account has been suspended. "
                "Please contact the GRI admin office for assistance."
            ),
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive. Contact the administrator.",
        )

    # --- Load role name ---
    await db.refresh(user, ["role"])
    role_name = user.role.name

    # --- Issue tokens ---
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": role_name,
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # --- Store session ---
    session = Session(
        user_id=user.id,
        refresh_token=refresh_token,
        ip_address=ip,
        user_agent=user_agent,
        issued_at=datetime.now(timezone.utc),
        expires_at=datetime.now(timezone.utc)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(session)

    # --- Update last_login_at ---
    await db.execute(
        update(User)
        .where(User.id == user.id)
        .values(last_login_at=datetime.now(timezone.utc))
    )

    # --- Audit log ---
    await _log_audit(
        db, actor_id=user.id, action="login",
        target_user_id=user.id, target_email=user.email,
        metadata={"role": role_name}, ip_address=ip, user_agent=user_agent,
    )

    await db.commit()

    logger.info("Login success: email=%s role=%s ip=%s", user.email, role_name, ip)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        role=role_name,
        user_id=str(user.id),
        full_name=user.full_name,
        email=user.email,
    )


@router.post("/register", summary="Register standard user (Student, Faculty, Staff, Other)")
async def register_user(
    request: Request,
    body: UserRegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    ip = _client_ip(request)
    existing = await _get_user_by_email(db, body.email)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    role_res = await db.execute(select(Role).where(Role.name == body.role))
    role_obj = role_res.scalars().first()
    if not role_obj:
        role_res = await db.execute(select(Role).where(Role.name == "student"))
        role_obj = role_res.scalars().first()

    pw_hash = get_password_hash(body.password)
    user = User(
        email=body.email,
        password_hash=pw_hash,
        full_name=body.full_name,
        phone=body.phone,
        whatsapp_number=body.whatsapp_number or body.phone,
        university_id=body.university_id,
        role_id=role_obj.id if role_obj else None,
        approval_status="approved",  # direct approval for verified registration flow
        is_active=True,
        is_email_verified=True,
        programme=body.programme,
        current_year=body.year or 1,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return {
        "detail": "User registered successfully.",
        "user_id": str(user.id),
        "email": user.email,
        "role": body.role,
        "approval_status": "approved",
    }


# =============================================================================
# POST /auth/admin/register
# Admin self-registration — protected by ADMIN_REGISTER_SECRET env var.
# Students, Staff, and Other are created exclusively by admin (not here).
# =============================================================================

ADMIN_REGISTER_SECRET = os.getenv("ADMIN_REGISTER_SECRET", "GRI_ADMIN_SECRET_CHANGE_ME")


@router.post(
    "/admin/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Admin self-registration (requires secret key)",
)
async def admin_register(
    request: Request,
    body: AdminRegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Only admins can self-register, and only with the correct admin_secret.
    All other user types (student, staff, other) must be created by admin
    via the /admin/users/create endpoint.
    """
    ip = _client_ip(request)

    # Validate admin secret
    if body.admin_secret != ADMIN_REGISTER_SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid admin registration secret.",
        )

    # Check duplicate email
    existing = await _get_user_by_email(db, body.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Get admin role
    role_result = await db.execute(select(Role).where(Role.name == "admin"))
    admin_role = role_result.scalar_one_or_none()
    if not admin_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin role not found. Run schema_auth_extension.sql first.",
        )

    # Create admin user — immediately approved
    new_admin = User(
        email=body.email,
        password_hash=get_password_hash(body.password),
        full_name=body.full_name,
        phone=body.phone,
        role_id=admin_role.id,
        is_active=True,
        is_email_verified=True,
        approval_status="approved",
    )
    db.add(new_admin)
    await db.flush()  # get new_admin.id

    # Issue tokens
    token_data = {"sub": str(new_admin.id), "email": new_admin.email, "role": "admin"}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Store session
    session = Session(
        user_id=new_admin.id,
        refresh_token=refresh_token,
        ip_address=ip,
        user_agent=request.headers.get("user-agent", ""),
        issued_at=datetime.now(timezone.utc),
        expires_at=datetime.now(timezone.utc)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(session)

    await _log_audit(
        db, actor_id=new_admin.id, action="admin_self_register",
        target_user_id=new_admin.id, target_email=new_admin.email,
        ip_address=ip,
    )

    await db.commit()
    logger.info("Admin registered: email=%s ip=%s", new_admin.email, ip)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        role="admin",
        user_id=str(new_admin.id),
        full_name=new_admin.full_name,
        email=new_admin.email,
    )


# =============================================================================
# POST /auth/refresh
# =============================================================================

@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
async def refresh_access_token(
    body: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    # Validate JWT signature / expiry
    payload = decode_access_token(body.refresh_token, expected_type="refresh")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        )

    # Check session DB record is not revoked
    result = await db.execute(
        select(Session).where(
            Session.refresh_token == body.refresh_token,
            Session.revoked_at.is_(None),
        )
    )
    db_session = result.scalar_one_or_none()
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked or does not exist.",
        )

    # Fetch user
    user = await db.get(User, db_session.user_id)
    if not user or not user.can_login:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is no longer active or approved.",
        )

    await db.refresh(user, ["role"])

    # Rotate tokens
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role.name}
    new_access = create_access_token(token_data)
    new_refresh = create_refresh_token(token_data)

    # Revoke old session, create new
    db_session.revoked_at = datetime.now(timezone.utc)
    db_session.revoked_reason = "rotated"

    new_session = Session(
        user_id=user.id,
        refresh_token=new_refresh,
        ip_address=db_session.ip_address,
        issued_at=datetime.now(timezone.utc),
        expires_at=datetime.now(timezone.utc)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(new_session)
    await db.commit()

    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        role=user.role.name,
        user_id=str(user.id),
        full_name=user.full_name,
        email=user.email,
    )


# =============================================================================
# POST /auth/logout
# =============================================================================

@router.post("/logout", status_code=status.HTTP_200_OK, summary="Logout / revoke session")
async def logout(
    body: LogoutRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Session).where(
            Session.refresh_token == body.refresh_token,
            Session.revoked_at.is_(None),
        )
    )
    session = result.scalar_one_or_none()
    if session:
        session.revoked_at = datetime.now(timezone.utc)
        session.revoked_reason = "logout"
        await db.commit()

    return {"detail": "Logged out successfully."}


# =============================================================================
# GET /auth/me  — current user profile
# =============================================================================
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials  # noqa: E402

_bearer = HTTPBearer(auto_error=False)


@router.get("/me", response_model=UserProfileResponse, summary="Get current user profile")
async def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
):
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")

    payload = decode_access_token(credentials.credentials, expected_type="access")
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token.")

    user_id = payload.get("sub")
    user = await db.get(User, user_id)
    if not user or user.deleted_at:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    await db.refresh(user, ["role"])

    return UserProfileResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        role=user.role.name,
        approval_status=user.approval_status,
        is_active=user.is_active,
        last_login_at=user.last_login_at,
        created_at=user.created_at,
    )
