"""
target_engine.py — Target Audience Engine for GRI University Notifications
Filtering recipients based on: Role, Department, Programme, Year/Semester, Batch,
Hostel, Placement Group, Research Group, Specific User ID / University Register Number.
"""
from typing import List, Dict, Any, Optional
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_

from backend.app.models.auth_models import User, Role


class TargetAudienceEngine:
    """Calculates recipient lists & estimated counts based on audience criteria."""

    async def get_target_users(
        self,
        db: AsyncSession,
        target_type: str,
        target_filter: Dict[str, Any],
    ) -> List[User]:
        """
        Queries and returns all active User records matching the target filter criteria.
        """
        query = select(User).where(and_(User.is_active == True, User.deleted_at.is_(None)))

        target_type = (target_type or "all").lower()

        if target_type == "all":
            pass  # return all active users

        elif target_type == "role":
            role_name = target_filter.get("role") or target_filter.get("target_role")
            if role_name and role_name != "all":
                query = query.join(Role).where(Role.name == role_name)

        elif target_type == "department":
            dept_id = target_filter.get("department_id")
            if dept_id:
                query = query.where(User.department_id == uuid.UUID(str(dept_id)))

        elif target_type == "programme":
            programme = target_filter.get("programme")
            if programme:
                query = query.where(User.programme == programme)

        elif target_type == "year":
            year = target_filter.get("year") or target_filter.get("current_year")
            if year:
                query = query.where(User.current_year == int(year))

        elif target_type == "batch":
            batch_year = target_filter.get("batch_year")
            if batch_year:
                query = query.where(User.batch_year == int(batch_year))

        elif target_type == "user":
            user_id = target_filter.get("user_id")
            reg_num = target_filter.get("university_id") or target_filter.get("register_number")
            if user_id:
                query = query.where(User.id == uuid.UUID(str(user_id)))
            elif reg_num:
                query = query.where(User.university_id == reg_num)

        # Composite multi-filters (e.g. Department = CS AND Year = 4)
        if "department_id" in target_filter and target_type != "department":
            query = query.where(User.department_id == uuid.UUID(str(target_filter["department_id"])))
        if "current_year" in target_filter and target_type != "year":
            query = query.where(User.current_year == int(target_filter["current_year"]))
        if "role" in target_filter and target_type != "role":
            query = query.join(Role).where(Role.name == target_filter["role"])

        result = await db.execute(query)
        users = list(result.scalars().all())
        return users

    async def estimate_recipient_count(
        self,
        db: AsyncSession,
        target_type: str,
        target_filter: Dict[str, Any],
    ) -> int:
        """
        Quickly estimates total recipient count before sending notification.
        """
        users = await self.get_target_users(db, target_type, target_filter)
        return len(users)


target_engine = TargetAudienceEngine()
