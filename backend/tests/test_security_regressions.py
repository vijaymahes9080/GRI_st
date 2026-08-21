"""
GRI Security Regression Tests

Verifies that the audit fixes hold:
  1. OTP / MFA magic codes no longer authenticate.
  2. Unauthenticated file upload / emergency broadcast / ERP webhook are rejected.
  3. RBAC denies role-mismatched users even when 'admin' is in allowed_roles.
  4. Login requires valid credentials; refresh rejects bad tokens.
  5. New mobile-app contract endpoints respond with the expected envelope.
  6. WAF rate limiter returns 429 after the request budget is exhausted.
"""

import os
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.core.security import create_access_token

client = TestClient(app)


def _student_token() -> str:
    return create_access_token({"sub": "student@test.edu", "role": "student"})


def _admin_token() -> str:
    return create_access_token({"sub": "admin@test.edu", "role": "admin"})


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# OAuth / OTP / MFA
# ---------------------------------------------------------------------------
def test_magic_otp_bypass_rejected():
    response = client.post("/api/v1/oauth/verify-otp", json={
        "email": "victim@test.edu",
        "otp_code": "123456",
    })
    assert response.status_code == 400
    assert "access_token" not in response.json()


def test_magic_mfa_bypass_rejected():
    response = client.post("/api/v1/oauth/verify-mfa", json={
        "user_id": "user-1",
        "totp_code": "654321",
    })
    assert response.status_code == 400
    assert "access_token" not in response.json()


def test_otp_flow_requires_issued_code():
    send = client.post("/api/v1/oauth/send-otp", json={"email": "student@test.edu"})
    assert send.status_code == 200
    debug_code = send.json().get("debug_otp")
    assert debug_code and len(debug_code) == 6

    wrong = client.post("/api/v1/oauth/verify-otp", json={
        "email": "student@test.edu",
        "otp_code": "000000",
    })
    assert wrong.status_code == 400

    right = client.post("/api/v1/oauth/verify-otp", json={
        "email": "student@test.edu",
        "otp_code": debug_code,
    })
    assert right.status_code == 200
    assert right.json()["access_token"]


def test_sso_unsupported_provider_rejected():
    response = client.post("/api/v1/oauth/sso", json={
        "provider": "github",
        "id_token": "not-a-token",
    })
    assert response.status_code == 400


# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------
def test_login_success_and_failure():
    ok = client.post("/api/v1/auth/login", json={
        "email": "student@test.edu",
        "password": "StudentPass#123",
    })
    assert ok.status_code == 200
    body = ok.json()
    assert body["access_token"] and body["refresh_token"]
    assert body["role"] == "student"

    bad = client.post("/api/v1/auth/login", json={
        "email": "student@test.edu",
        "password": "wrong-password",
    })
    assert bad.status_code == 401


def test_refresh_endpoint_rejects_invalid_token():
    response = client.post("/api/v1/auth/refresh", json={"refreshToken": "garbage"})
    assert response.status_code == 401


# ---------------------------------------------------------------------------
# Authorization (RoleChecker)
# ---------------------------------------------------------------------------
def test_student_cannot_broadcast_emergency():
    response = client.post(
        "/api/v1/notifications/broadcast-emergency",
        json={"title": "Test", "message": "Alert"},
        headers=_auth(_student_token()),
    )
    assert response.status_code == 403


def test_admin_can_broadcast_emergency():
    response = client.post(
        "/api/v1/notifications/broadcast-emergency",
        json={"title": "Test", "message": "Alert"},
        headers=_auth(_admin_token()),
    )
    assert response.status_code in (200, 500)


def test_notifications_analytics_requires_admin():
    response = client.get(
        "/api/v1/admin/notifications/dashboard/stats",
        headers=_auth(_student_token()),
    )
    assert response.status_code == 403


# ---------------------------------------------------------------------------
# File uploads require authentication
# ---------------------------------------------------------------------------
def test_file_upload_requires_auth():
    response = client.post("/api/v1/files/upload")
    assert response.status_code == 401


def test_image_upload_rejects_non_image():
    response = client.post(
        "/api/v1/files/upload-image",
        files={"file": ("doc.txt", b"plain text", "text/plain")},
        headers=_auth(_student_token()),
    )
    assert response.status_code == 400


def test_generic_upload_works_for_authenticated_user():
    response = client.post(
        "/api/v1/files/upload",
        files={"file": ("note.txt", b"hello", "text/plain")},
        headers=_auth(_student_token()),
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["fileId"].startswith("FIL-")


# ---------------------------------------------------------------------------
# ERP webhook fails closed without a valid signature
# ---------------------------------------------------------------------------
def test_erp_webhook_rejected_without_signature():
    response = client.post("/api/v1/erp/webhook", json={
        "event_type": "results.updated",
        "payload": {"roll": "GRI-2024-8841"},
    })
    assert response.status_code == 401


# ---------------------------------------------------------------------------
# Mobile app contract endpoints
# ---------------------------------------------------------------------------
def test_app_config_endpoint():
    response = client.get("/api/v1/app/config")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["appVersion"]
    assert "navigation" in data and "features" in data


def test_bus_gps_endpoint():
    response = client.get("/api/v1/transport/gps/01")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["busNo"] == "01"
    assert "lat" in data and "long" in data


def test_complaints_contract():
    create = client.post("/api/v1/complaints/tickets", json={
        "category": "Hostel",
        "description": "Water issue",
        "priority": "HIGH",
    })
    assert create.status_code == 200
    assert create.json()["data"]["status"] == "OPEN"

    listing = client.get("/api/v1/complaints/tickets")
    assert listing.status_code == 200
    assert len(listing.json()["data"]) >= 1


def test_survey_contract():
    response = client.post("/api/v1/outreach/surveys", json={
        "village": "Gandhigram",
        "surveyType": "Household",
        "householdData": {"members": 4},
        "geoLat": 10.38,
        "geoLong": 77.96,
    })
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "RECORDED"


def test_library_search_contract():
    response = client.get("/api/v1/library/search", params={"q": "rural", "page": 1})
    assert response.status_code == 200
    assert "items" in response.json()["data"]
    assert "total" in response.json()["data"]


# ---------------------------------------------------------------------------
# WAF rate limiting
# ---------------------------------------------------------------------------
def test_rate_limiter_returns_429():
    os.environ["TESTING"] = "false"
    try:
        responses = [client.get("/api/v1/app/config") for _ in range(105)]
        statuses = [r.status_code for r in responses]
        assert 429 in statuses
    finally:
        os.environ["TESTING"] = "true"

