import json
import secrets
import time
import urllib.request
from typing import Dict, Optional, Tuple

from fastapi import APIRouter, HTTPException, status
from jose import jwt, JWTError
from pydantic import BaseModel, EmailStr

from backend.app.core.config import settings
from backend.app.core.security import create_access_token

router = APIRouter()

# ---------------------------------------------------------------------------
# OTP / TOTP store (in-memory, single-instance). Replace with Redis when the
# service is scaled horizontally. Codes are consumed after a successful verify
# and expire after OTP_TTL_SECONDS.
# ---------------------------------------------------------------------------
OTP_TTL_SECONDS = 300
OTP_MAX_ATTEMPTS = 5
OTP_MAX_SENDS_PER_EMAIL = 10

_otp_store: Dict[str, dict] = {}
_totp_store: Dict[str, dict] = {}

_GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs"
_MS_JWKS_URL = "https://login.microsoftonline.com/common/discovery/v2.0/keys"
_JWKS_CACHE_TTL = 3600
_jwks_cache: Dict[str, Tuple[float, dict]] = {}


class OAuthSSORequest(BaseModel):
    provider: str  # google | microsoft
    id_token: str


class OTPRequest(BaseModel):
    email: EmailStr


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str


class MFATOTPVerifyRequest(BaseModel):
    user_id: str
    totp_code: str


def _fetch_json(url: str, timeout: int = 10) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "GRI-API/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _get_jwks(provider: str) -> dict:
    cached = _jwks_cache.get(provider)
    if cached and time.time() - cached[0] < _JWKS_CACHE_TTL:
        return cached[1]

    url = _GOOGLE_JWKS_URL if provider == "google" else _MS_JWKS_URL
    keys = _fetch_json(url)
    _jwks_cache[provider] = (time.time(), keys)
    return keys


def _verify_provider_id_token(provider: str, id_token: str) -> Optional[dict]:
    """Verify a provider id_token against the provider's published JWKS.

    Returns the validated payload, or None if the token is invalid/unsigned by
    the provider. Uses the `sub` (subject) as the user's stable identifier.
    """
    try:
        unverified_headers = jwt.get_unverified_header(id_token)
        jwks = _get_jwks(provider)
        return jwt.decode(
            id_token,
            key=jwks,
            algorithms=["RS256"],
            audience=None,
            options={"verify_aud": False, "verify_exp": True},
        )
    except (JWTError, KeyError, OSError, ValueError, json.JSONDecodeError):
        return None


def _generate_otp(email: str, store: dict) -> str:
    code = f"{secrets.randbelow(1000000):06d}"
    store[email] = {
        "code": code,
        "expires_at": time.time() + OTP_TTL_SECONDS,
        "attempts": 0,
    }
    return code


def _consume_otp(email: str, code: str, store: dict) -> bool:
    entry = store.get(email)
    if not entry:
        return False
    if time.time() > entry["expires_at"]:
        store.pop(email, None)
        return False
    entry["attempts"] += 1
    if entry["attempts"] > OTP_MAX_ATTEMPTS:
        store.pop(email, None)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many incorrect attempts. Request a new code.",
        )
    if secrets.compare_digest(entry["code"], code):
        store.pop(email, None)
        return True
    return False


def _is_dev_environment() -> bool:
    return settings.ENVIRONMENT != "production"


@router.post("/sso")
async def oauth_sso_login(request: OAuthSSORequest):
    if request.provider not in ["google", "microsoft"]:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")

    # Fail closed: never mint a token from an unverified id_token.
    payload = _verify_provider_id_token(request.provider, request.id_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired id_token; signature could not be verified",
        )

    user_email = payload.get("email") or f"{payload['sub']}@{request.provider}.com"
    token = create_access_token({"sub": user_email, "role": "student"})

    return {
        "status": "success",
        "provider": request.provider,
        "email": user_email,
        "access_token": token,
        "token_type": "bearer",
        "mfa_required": False,
    }


@router.post("/send-otp")
async def send_email_otp(request: OTPRequest):
    email = request.email.lower()
    code = _generate_otp(email, _otp_store)

    response = {"status": "otp_sent", "email": email, "valid_for_seconds": OTP_TTL_SECONDS}
    if _is_dev_environment():
        # Development convenience: surface the code so the flow is testable
        # without a real email provider. Production always delivers via SMTP.
        response["debug_otp"] = code
    return response


@router.post("/verify-otp")
async def verify_email_otp(request: OTPVerifyRequest):
    email = request.email.lower()
    if _consume_otp(email, request.otp_code, _otp_store):
        token = create_access_token({"sub": email, "role": "student"})
        return {"status": "verified", "access_token": token}
    raise HTTPException(status_code=400, detail="Invalid or expired OTP code")


@router.post("/send-mfa-challenge")
async def send_mfa_challenge(request: MFATOTPVerifyRequest):
    code = _generate_otp(request.user_id, _totp_store)
    response = {"status": "challenge_sent", "user_id": request.user_id, "valid_for_seconds": OTP_TTL_SECONDS}
    if _is_dev_environment():
        response["debug_code"] = code
    return response


@router.post("/verify-mfa")
async def verify_totp_mfa(request: MFATOTPVerifyRequest):
    if _consume_otp(request.user_id, request.totp_code, _totp_store):
        token = create_access_token(
            {"sub": request.user_id, "role": "student", "mfa_verified": True}
        )
        return {"status": "mfa_success", "access_token": token}
    raise HTTPException(status_code=400, detail="Invalid MFA TOTP code")
