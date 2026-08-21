import logging
from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.core.security import decode_access_token

security_bearer = HTTPBearer(auto_error=False)
logger = logging.getLogger("audit_logger")


class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, credentials: HTTPAuthorizationCredentials | None = Depends(security_bearer)):
        if credentials is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )

        payload = decode_access_token(credentials.credentials, expected_type="access")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired access token",
            )

        user_role = payload.get("role")
        user_email = payload.get("sub")

        # Authorization: allow explicit role membership; the admin role acts as a
        # superuser and may access every protected endpoint.
        if user_role not in self.allowed_roles and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden. Role '{user_role}' lacks required permissions.",
            )

        return payload
