"""
notification_models.py — SQLAlchemy ORM models for GRI Notification Engine & Dynamic CMS.
Maps to: infra.official_notifications, infra.notification_recipients,
         infra.notification_channels, infra.notification_preferences,
         infra.cms_content
"""
import uuid
from datetime import datetime
from typing import Optional, Any, Dict, List

from sqlalchemy import (
    Boolean, CheckConstraint, DateTime, ForeignKey, Integer, String, Text, func, JSON
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base


# ---------------------------------------------------------------------------
# infra.notification_preferences
# ---------------------------------------------------------------------------
class NotificationPreference(Base):
    __tablename__ = "notification_preferences"
    __table_args__ = {"schema": "infra"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("core.users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    push_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    email_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    whatsapp_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sms_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    in_app_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    academic_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    event_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    placement_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    emergency_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


# ---------------------------------------------------------------------------
# infra.official_notifications
# ---------------------------------------------------------------------------
class OfficialNotification(Base):
    __tablename__ = "official_notifications"
    __table_args__ = {"schema": "infra"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="general")
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="NORMAL")
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="DRAFT")

    attachment_url: Mapped[Optional[str]] = mapped_column(Text)
    deep_link: Mapped[Optional[str]] = mapped_column(Text)

    target_type: Mapped[str] = mapped_column(String(50), nullable=False, default="all")
    target_filter: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    channels: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)

    estimated_recipients: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    actual_recipients: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text)

    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("core.users.id"), nullable=False)
    submitted_by: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("core.users.id"))
    approved_by: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("core.users.id"))

    submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    scheduled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    recipients: Mapped[List["NotificationRecipient"]] = relationship(
        "NotificationRecipient", back_populates="notification", cascade="all, delete-orphan"
    )
    channel_logs: Mapped[List["NotificationChannel"]] = relationship(
        "NotificationChannel", back_populates="notification", cascade="all, delete-orphan"
    )


# ---------------------------------------------------------------------------
# infra.notification_recipients
# ---------------------------------------------------------------------------
class NotificationRecipient(Base):
    __tablename__ = "notification_recipients"
    __table_args__ = {"schema": "infra"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    notification_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("infra.official_notifications.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("core.users.id", ondelete="CASCADE"), nullable=False
    )
    delivery_status: Mapped[str] = mapped_column(String(20), nullable=False, default="queued")
    read_status: Mapped[str] = mapped_column(String(20), nullable=False, default="unread")
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    notification: Mapped["OfficialNotification"] = relationship("OfficialNotification", back_populates="recipients")


# ---------------------------------------------------------------------------
# infra.notification_channels
# ---------------------------------------------------------------------------
class NotificationChannel(Base):
    __tablename__ = "notification_channels"
    __table_args__ = {"schema": "infra"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    notification_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("infra.official_notifications.id", ondelete="CASCADE"), nullable=False
    )
    channel: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    provider_message_id: Mapped[Optional[str]] = mapped_column(String(255))
    sent_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    delivered_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    failed_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    error_message: Mapped[Optional[str]] = mapped_column(Text)
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    failed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    notification: Mapped["OfficialNotification"] = relationship("OfficialNotification", back_populates="channel_logs")


# ---------------------------------------------------------------------------
# infra.cms_content
# ---------------------------------------------------------------------------
class CMSContent(Base):
    __tablename__ = "cms_content"
    __table_args__ = {"schema": "infra"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text)
    content_body: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="announcement")
    image_url: Mapped[Optional[str]] = mapped_column(Text)
    attachment_url: Mapped[Optional[str]] = mapped_column(Text)
    external_url: Mapped[Optional[str]] = mapped_column(Text)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    target_role: Mapped[str] = mapped_column(String(50), default="all")
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("core.departments.id"))
    event_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("core.users.id"), nullable=False)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
