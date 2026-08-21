"""
cms.py — Dynamic University Content Management System API
Allows Admin to control announcements, news, events, circulars, banners dynamically
so the React Native mobile app updates without code deployment.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from backend.app.core.database import get_db
from backend.app.core.rbac import RoleChecker
from backend.app.models.auth_models import User
from backend.app.models.notification_models import CMSContent

router = APIRouter()

admin_only = RoleChecker(allowed_roles=["admin", "SUPER_ADMIN", "CONTENT_MANAGER"])
authenticated = RoleChecker(allowed_roles=["student", "faculty", "admin", "staff", "other"])


class CreateCMSRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    summary: Optional[str] = None
    content_body: str = Field(..., min_length=1)
    category: str = Field("announcement", description="announcement|news|event|circular|notice|download|banner|placement|research")
    image_url: Optional[str] = None
    attachment_url: Optional[str] = None
    external_url: Optional[str] = None
    is_published: bool = True
    is_featured: bool = False
    target_role: str = "all"
    event_date: Optional[datetime] = None


@router.get("/content", summary="Get public/user dynamic CMS content")
async def get_cms_content(
    category: Optional[str] = Query(None),
    is_featured: Optional[bool] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(CMSContent).where(CMSContent.is_published == True)
    if category:
        query = query.where(CMSContent.category == category)
    if is_featured is not None:
        query = query.where(CMSContent.is_featured == is_featured)

    query = query.order_by(CMSContent.created_at.desc()).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return {
        "count": len(items),
        "items": items,
    }


@router.post("/admin/content", summary="Admin create dynamic CMS content")
async def create_cms_content(
    request: CreateCMSRequest,
    admin_payload: dict = Depends(admin_only),
    db: AsyncSession = Depends(get_db),
):
    admin_email = admin_payload.get("sub")
    user_res = await db.execute(select(User).where(User.email == admin_email))
    admin_user = user_res.scalars().first()

    cms_item = CMSContent(
        title=request.title,
        summary=request.summary,
        content_body=request.content_body,
        category=request.category,
        image_url=request.image_url,
        attachment_url=request.attachment_url,
        external_url=request.external_url,
        is_published=request.is_published,
        is_featured=request.is_featured,
        target_role=request.target_role,
        event_date=request.event_date,
        created_by=admin_user.id if admin_user else uuid.uuid4(),
    )
    db.add(cms_item)
    await db.commit()
    await db.refresh(cms_item)
    return {"detail": "CMS content created successfully.", "item": cms_item}
