"""
auth_models.py — SQLAlchemy ORM models for the GRI authentication system.
Maps to: core.users, core.roles, core.sessions, core.audit_log,
         core.student_profiles, core.faculty_profiles,
         core.staff_profiles, core.other_profiles
"""
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean, CheckConstraint, DateTime, ForeignKey,
    String, Text, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base


# ---------------------------------------------------------------------------
# core.roles
# ---------------------------------------------------------------------------
class Role(Base):
    __tablename__ = "roles"
    __table_args__ = {"schema": "core"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationship
    users: Mapped[list["User"]] = relationship("User", back_populates="role")


# ---------------------------------------------------------------------------
# core.users
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "approval_status IN ('approved','pending','rejected','suspended')",
            name="ck_users_approval_status",
        ),
        {"schema": "core"},
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    whatsapp_number: Mapped[Optional[str]] = mapped_column(String(20))
    university_id: Mapped[Optional[str]] = mapped_column(String(50))
    full_name: Mapped[Optional[str]] = mapped_column(Text)
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("core.departments.id"), nullable=True)
    programme: Mapped[Optional[str]] = mapped_column(Text)
    batch_year: Mapped[Optional[int]] = mapped_column(nullable=True)
    current_year: Mapped[Optional[int]] = mapped_column(nullable=True, default=1)
    notes: Mapped[Optional[str]] = mapped_column(Text)

    # Role FK
    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("core.roles.id"), nullable=False
    )

    # Status flags
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # Admin-controlled approval
    approval_status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="approved"
    )
    approved_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("core.users.id"), nullable=True
    )
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("core.users.id"), nullable=True
    )

    # Security
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    mfa_secret: Mapped[Optional[str]] = mapped_column(Text)

    # Timestamps
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    role: Mapped["Role"] = relationship("Role", back_populates="users")
    sessions: Mapped[list["Session"]] = relationship("Session", back_populates="user",
                                                       foreign_keys="Session.user_id")

    # Convenience property
    @property
    def is_admin(self) -> bool:
        return self.role.name == "admin"

    @property
    def can_login(self) -> bool:
        return self.approval_status == "approved" and self.is_active and self.deleted_at is None


# ---------------------------------------------------------------------------
# core.sessions
# ---------------------------------------------------------------------------
class Session(Base):
    __tablename__ = "sessions"
    __table_args__ = {"schema": "core"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("core.users.id", ondelete="CASCADE"), nullable=False
    )
    refresh_token: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    user_agent: Mapped[Optional[str]] = mapped_column(Text)
    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    revoked_reason: Mapped[Optional[str]] = mapped_column(String(50))

    user: Mapped["User"] = relationship("User", back_populates="sessions",
                                         foreign_keys=[user_id])


# ---------------------------------------------------------------------------
# core.audit_log
# ---------------------------------------------------------------------------
class AuditLog(Base):
    __tablename__ = "audit_log"
    __table_args__ = {"schema": "core"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    actor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("core.users.id"), nullable=False
    )
    action: Mapped[str] = mapped_column(String(60), nullable=False)
    target_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("core.users.id"), nullable=True
    )
    target_email: Mapped[Optional[str]] = mapped_column(String(255))
    metadata_: Mapped[Optional[str]] = mapped_column("metadata", Text)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    user_agent: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
