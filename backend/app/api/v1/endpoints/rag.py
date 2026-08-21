from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.app.ai.rag_pipeline import rag_engine

router = APIRouter()

class RAGQueryRequest(BaseModel):
    question: str
    domain: Optional[str] = "general" # general | admission | placement | research | hostel

class RAGQueryResponse(BaseModel):
    question: str
    answer: str
    citations: List[str]
    confidence_score: float
    llm_model: str

@router.post("/query", response_model=RAGQueryResponse)
async def execute_rag_query(request: RAGQueryRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    result = await rag_engine.query(request.question, domain=request.domain)
    return RAGQueryResponse(**result)

@router.post("/summarize-document")
async def summarize_academic_document(doc_title: str):
    return {
        "title": doc_title,
        "summary": "This document outlines the evaluation framework, attendance thresholds (75%), and credit distribution for GRI CBCS programmes.",
        "key_takeaways": [
            "Continuous Internal Assessment (CIA): 40% weightage",
            "End Semester Examination (ESE): 60% weightage",
            "Minimum 75% attendance mandatory for ESE hall ticket"
        ]
    }
