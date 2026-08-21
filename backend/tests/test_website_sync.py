"""
Automated Unit Test Suite for Official GRI Website Sync & Integration Endpoints
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_get_live_circulars():
    response = client.get("/api/v1/website/circulars")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert isinstance(json_data["data"], list)

def test_get_live_events():
    response = client.get("/api/v1/website/events")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) > 0

def test_get_student_corner():
    response = client.get("/api/v1/website/student-corner")
    assert response.status_code == 200
    json_data = response.json()
    assert "portals" in json_data["data"]
    assert "examinations" in json_data["data"]

def test_get_official_navigation():
    response = client.get("/api/v1/website/navigation")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 5

def test_get_official_portals():
    response = client.get("/api/v1/website/portals")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    portals = json_data["data"]
    portal_names = [p["name"] for p in portals]
    assert any("Samarth" in name for name in portal_names)

def test_get_governance_structure():
    response = client.get("/api/v1/website/governance")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "chancellor" in json_data["data"]
    assert "bodies" in json_data["data"]

def test_get_schools_and_centres():
    response = client.get("/api/v1/website/schools-and-centres")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) > 0

def test_get_campus_facilities():
    response = client.get("/api/v1/website/facilities")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert any(item["name"] == "Central Library" for item in json_data["data"])

def test_get_live_home():
    response = client.get("/api/v1/website/live-home")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "activeAdmissions" in json_data["data"]

