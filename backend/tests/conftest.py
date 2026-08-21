"""
Shared pytest fixtures and test environment bootstrap.

Environment variables must be set BEFORE backend.app is imported because
Settings is instantiated at import time. A conftest module is imported before
any test module, so this guarantees the mock-user flag is available to the
auth endpoints.
"""

import os

os.environ.setdefault("ALLOW_MOCK_USERS", "true")
os.environ.setdefault("MOCK_STUDENT_EMAIL", "student@test.edu")
os.environ.setdefault("MOCK_STUDENT_PASSWORD", "StudentPass#123")
os.environ.setdefault("MOCK_FACULTY_EMAIL", "faculty@test.edu")
os.environ.setdefault("MOCK_FACULTY_PASSWORD", "FacultyPass#123")
os.environ.setdefault("ENVIRONMENT", "testing")
os.environ.setdefault("TESTING", "true")

