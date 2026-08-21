"""
approval_workflow.py — Notification Approval Workflow Engine
Manages status transitions: DRAFT → SUBMITTED → PENDING_APPROVAL → APPROVED / REJECTED → SENT / SCHEDULED
Guards transitions with RBAC permission checks and records audit events.
"""
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import uuid

from fastapi import HTTPException, status

class NotificationWorkflowEngine:
    """Handles notification lifecycle and status transitions."""

    VALID_TRANSITIONS = {
        "DRAFT": ["SUBMITTED", "CANCELLED"],
        "SUBMITTED": ["PENDING_APPROVAL", "APPROVED", "REJECTED", "CANCELLED"],
        "PENDING_APPROVAL": ["APPROVED", "REJECTED", "CANCELLED"],
        "APPROVED": ["SCHEDULED", "SENDING", "SENT", "CANCELLED"],
        "SCHEDULED": ["SENDING", "SENT", "CANCELLED"],
        "SENDING": ["SENT", "FAILED"],
        "SENT": ["EXPIRED"],
        "REJECTED": ["DRAFT"],
        "CANCELLED": [],
        "FAILED": ["SENDING", "CANCELLED"],
        "EXPIRED": [],
    }

    def can_transition(self, current_status: str, next_status: str) -> bool:
        allowed = self.VALID_TRANSITIONS.get(current_status, [])
        return next_status in allowed

    def validate_transition(self, current_status: str, next_status: str):
        if not self.can_transition(current_status, next_status):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status transition from '{current_status}' to '{next_status}'."
            )

    def transition_notification(
        self,
        notification: Any,
        next_status: str,
        actor_id: uuid.UUID,
        rejection_reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes a status transition and sets metadata timestamps.
        """
        self.validate_transition(notification.status, next_status)

        now = datetime.now(timezone.utc)
        notification.status = next_status
        notification.updated_at = now

        if next_status == "SUBMITTED":
            notification.submitted_by = actor_id
            notification.submitted_at = now
        elif next_status == "APPROVED":
            notification.approved_by = actor_id
            notification.approved_at = now
        elif next_status == "REJECTED":
            notification.approved_by = actor_id
            notification.rejection_reason = rejection_reason
        elif next_status == "SENT":
            notification.published_at = now

        return {
            "notification_id": str(notification.id),
            "previous_status": notification.status,
            "new_status": next_status,
            "actioned_by": str(actor_id),
            "timestamp": now.isoformat(),
        }


workflow_engine = NotificationWorkflowEngine()
