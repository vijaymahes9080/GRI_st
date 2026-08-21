"""
GRI Enterprise Security & WAF Middleware
Implements OWASP Top 10 Mitigations, Rate Limiting, Security Headers, and Input Sanitization

Author  : Chief Information Security Officer (Vijay Mahes)
Version : 1.1.0
"""

import os
import re
import time
import logging
from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse, Response

logging.basicConfig(level=logging.INFO)
security_logger = logging.getLogger("security_waf")


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforce OWASP Recommended Security Headers on all HTTP responses."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # OWASP Security Headers
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self' https://api.ruraluniv.ac.in;"
        )
        response.headers["Permissions-Policy"] = "geolocation=(self), camera=(), microphone=()"

        return response


class RateLimiterWAFMiddleware(BaseHTTPMiddleware):
    """Sliding Window Rate Limiter (Max 100 requests / minute per client).

    Client identity honors the X-Forwarded-For header when behind a reverse
    proxy, otherwise falls back to the direct connection IP. The in-memory
    store is bounded: stale windows are pruned on every request and the whole
    map is compacted once it grows beyond MAX_TRACKED_CLIENTS.
    """

    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.ip_history = {}
        self.MAX_TRACKED_CLIENTS = 10000
        self.BYPASS_PREFIXES = ("/health", "/metrics", "/docs", "/redoc", "/openapi.json")

    def _client_key(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    def _prune(self, client_ip: str, current_time: float):
        history = self.ip_history.get(client_ip)
        if not history:
            return
        alive = [t for t in history if current_time - t < self.window_seconds]
        if alive:
            self.ip_history[client_ip] = alive
        else:
            self.ip_history.pop(client_ip, None)

    async def dispatch(self, request: Request, call_next) -> Response:
        path = request.url.path
        if os.environ.get("TESTING") == "true" or any(path.startswith(p) for p in self.BYPASS_PREFIXES):
            return await call_next(request)

        client_ip = self._client_key(request)
        current_time = time.time()

        if len(self.ip_history) > self.MAX_TRACKED_CLIENTS:
            # Compaction pass: drop every client whose window has expired.
            self.ip_history = {
                ip: ts for ip, ts in self.ip_history.items()
                if any(current_time - t < self.window_seconds for t in ts)
            }

        self._prune(client_ip, current_time)
        history = self.ip_history.setdefault(client_ip, [])

        if len(history) >= self.max_requests:
            security_logger.warning(f"[WAF RATE LIMIT EXCEEDED] IP: {client_ip} | Path: {path}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded. Maximum 100 requests per minute allowed."},
            )

        history.append(current_time)
        return await call_next(request)


def sanitize_input(text: str) -> str:
    """Sanitize input string against XSS & SQL Injection attack vectors.

    Uses word boundaries so legitimate words (e.g. "character", "channel",
    "statement") are not mangled by keyword removal. Strips dangerous HTML
    tags and quoted SQL metacharacter sequences.
    """
    if not text:
        return text

    cleaned = re.sub(r"<script.*?</script>", "", text, flags=re.IGNORECASE | re.DOTALL)
    cleaned = re.sub(r"<[^>]*script[^>]*>", "", cleaned, flags=re.IGNORECASE)

    sql_tokens = ["alter", "drop", "truncate", "union", "select", "insert", "delete", "update"]
    for token in sql_tokens:
        cleaned = re.sub(rf"\b{token}\b", "", cleaned, flags=re.IGNORECASE)

    # Neutralize stacked-query and comment metacharacters.
    cleaned = re.sub(r"(--|/\*|\*/\s)", "", cleaned)
    cleaned = re.sub(r"(\bchar\b|\bnchar\b|@@)", "", cleaned, flags=re.IGNORECASE)

    return cleaned.strip()
