"""
GRI FastAPI Automated API Test Suite
Tests Health, Timetable, Exams, Hostel Outpass, and RAG AI endpoints
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "healthy"

def test_timetable_endpoint():
    response = client.get("/api/v1/academics/timetable")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1

def test_exam_results_endpoint():
    response = client.get("/api/v1/examinations/results?semester=3")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "cgpa" in json_data["meta"]

def test_hostel_outpass_endpoint():
    response = client.get("/api/v1/hostel/outpass")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True

def test_website_circulars_endpoint():
    response = client.get("/api/v1/website/circulars")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1

def test_website_events_endpoint():
    response = client.get("/api/v1/website/events")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1

def test_website_tenders_endpoint():
    response = client.get("/api/v1/website/tenders")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1

def test_website_careers_endpoint():
    response = client.get("/api/v1/website/careers")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1

def test_website_student_corner_endpoint():
    response = client.get("/api/v1/website/student-corner")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "portals" in json_data["data"]

