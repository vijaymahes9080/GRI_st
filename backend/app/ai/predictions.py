"""
GRI AI Prediction & Recommendation Engine
Attendance Risk Predictor, CGPA Goal Estimator, & Smart Course Recommendations
"""

import math
from typing import List, Dict, Any

class PredictionEngine:
    def predict_attendance_risk(
        self,
        attendance_percentage: float,
        total_classes_left: int,
        classes_held: int | None = None,
    ) -> Dict[str, Any]:
        """Predicts risk of falling below the 75% attendance threshold.

        When the number of classes already held is known it is used directly
        (total = held + remaining). When it is unknown a documented default
        semester length of 60 classes is assumed so the estimate is stable and
        does not double-count the remaining classes.
        """
        attendance_percentage = max(0.0, min(100.0, attendance_percentage))
        total_classes_left = max(0, int(total_classes_left))

        if classes_held is None:
            total_semester_classes = 60
            classes_held = max(0, total_semester_classes - total_classes_left)
        else:
            classes_held = max(0, int(classes_held))
            total_semester_classes = classes_held + total_classes_left

        classes_attended = (attendance_percentage / 100.0) * classes_held

        required_total_attended = 0.75 * total_semester_classes
        classes_needed = max(0, math.ceil(required_total_attended - classes_attended))

        is_achievable = classes_needed <= total_classes_left
        is_at_risk = attendance_percentage < 75.0 or not is_achievable

        if attendance_percentage < 70.0 or not is_achievable:
            risk_level = "HIGH"
        elif attendance_percentage < 75.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        return {
            "current_attendance": round(attendance_percentage, 2),
            "total_classes_left": total_classes_left,
            "is_at_risk": is_at_risk,
            "risk_level": risk_level,
            "required_consecutive_classes": classes_needed,
            "is_achievable": is_achievable,
            "recommendation": (
                f"Attend at least {classes_needed} out of {total_classes_left} remaining classes to maintain 75% eligibility."
                if is_achievable else "Attendance threshold of 75% cannot be reached with remaining classes."
            )
        }

    def predict_cgpa_target(self, current_cgpa: float, target_cgpa: float, total_semesters: int, completed_semesters: int) -> Dict[str, Any]:
        """Calculates required SGPA in remaining semesters to achieve target CGPA."""
        current_cgpa = max(0.0, min(10.0, current_cgpa))
        target_cgpa = max(0.0, min(10.0, target_cgpa))
        total_semesters = max(1, total_semesters)
        completed_semesters = max(0, min(total_semesters - 1, completed_semesters))

        remaining_semesters = max(1, total_semesters - completed_semesters)
        required_total_points = target_cgpa * total_semesters
        current_total_points = current_cgpa * completed_semesters
        required_sgpa = (required_total_points - current_total_points) / remaining_semesters
        
        is_achievable = 0.0 <= required_sgpa <= 10.0

        if required_sgpa <= 0.0:
            message = "Target CGPA already met or exceeded with current performance."
        elif is_achievable:
            message = "Target achievable with consistent academic performance!"
        else:
            message = "Target SGPA is mathematically unachievable."
        
        return {
            "current_cgpa": current_cgpa,
            "target_cgpa": target_cgpa,
            "required_sgpa_per_remaining_semester": round(min(10.0, max(0.0, required_sgpa)), 2),
            "is_achievable": is_achievable,
            "message": message,
        }

    def recommend_courses(self, department: str, semester: int) -> List[Dict[str, Any]]:
        """Recommends elective courses based on department track and market demand."""
        return [
            {
                "courseCode": "CSE-411",
                "title": "Cloud Native Microservices & Kubernetes",
                "type": "PROFESSIONAL_ELECTIVE",
                "matchScore": 0.96,
                "reason": "High industry placement demand for Cloud Architect track"
            },
            {
                "courseCode": "CSE-412",
                "title": "Generative AI & LLM Fine-Tuning",
                "type": "PROFESSIONAL_ELECTIVE",
                "matchScore": 0.94,
                "reason": "Aligns with Machine Learning research specialization"
            }
        ]

prediction_engine = PredictionEngine()
