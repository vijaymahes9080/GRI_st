import logging
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from pydantic import ValidationError

from backend.app.core.security import decode_access_token

router = APIRouter()
logger = logging.getLogger("audit_logger")


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, role: str):
        await websocket.accept()
        self.active_connections.append((websocket, role))

    def disconnect(self, websocket: WebSocket):
        self.active_connections = [
            (conn, role) for conn, role in self.active_connections if conn is not websocket
        ]

    async def broadcast(self, message: dict, role: str | None = None):
        for conn, conn_role in list(self.active_connections):
            if role and conn_role != role:
                continue
            try:
                await conn.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()

ANNOUNCEMENT_MAX_LENGTH = 2000


@router.websocket("/ws/announcements")
async def websocket_announcements_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    payload = decode_access_token(token) if token else None
    if not payload:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_role = payload.get("role", "student")
    await manager.connect(websocket, user_role)

    try:
        while True:
            data = await websocket.receive_text()
            if len(data) > ANNOUNCEMENT_MAX_LENGTH:
                continue
            # Only admins/staff may publish announcements to all clients.
            if user_role not in ("admin", "staff"):
                await websocket.send_json({"type": "ERROR", "message": "Insufficient permissions to announce"})
                continue
            await manager.broadcast(
                {
                    "type": "ANNOUNCEMENT",
                    "content": data,
                    "author": payload.get("sub"),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
    except ValidationError:
        pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
