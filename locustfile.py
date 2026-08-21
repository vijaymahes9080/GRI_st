"""
GRI Mobile Platform High-Load Stress & Performance Test
Simulates 10,000 Concurrent Mobile Application API Requests
"""

from locust import HttpUser, task, between

class GriMobileUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def fetch_timetable(self):
        self.client.get("/api/v1/academics/timetable")

    @task(2)
    def fetch_exam_results(self):
        self.client.get("/api/v1/examinations/results?semester=3")

    @task(2)
    def fetch_outpass_list(self):
        self.client.get("/api/v1/hostel/outpass")

    @task(1)
    def query_rag_ai(self):
        self.client.get("/api/v1/ai/semantic-search?query=attendance+rule")
