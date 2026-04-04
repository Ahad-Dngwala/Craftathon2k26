"""
FastAPI service for the AI Content Classifier.

Exposes:
    POST /classify

This service acts as the external interface for the orchestrator pipeline.
It validates input, delegates processing, and returns structured results.

Run:
    uvicorn api:app --host 0.0.0.0 --port 8000

Author:
    Vishmayraj
"""

from typing import Optional, Any, Dict

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from orchestrator import analyze_input


app = FastAPI(title="AI Content Classifier")


class SignalResponse(BaseModel):
    nlp: Dict[str, Any]
    nsfw: Optional[Dict[str, Any]]
    clip: Optional[Dict[str, Any]]
    ocr: Optional[Dict[str, Any]]


class ClassifyResponse(BaseModel):
    cleaned_text: str
    extracted_urls: list[str]
    final_risk_score: str
    signals: SignalResponse


@app.post("/classify", response_model=ClassifyResponse)
async def classify_endpoint(
    text: str = Form(...),
    image: Optional[UploadFile] = File(None),
) -> Dict[str, Any]:
    if not text or not text.strip():
        raise HTTPException(status_code=422, detail="text must not be empty or whitespace")

    image_bytes = None
    if image is not None:
        image_bytes = await image.read()

    try:
        result = analyze_input(text, image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Classification failed: {exc}",
        ) from exc

    return {
        "cleaned_text": result["cleaned_text"],
        "extracted_urls": result["extracted_urls"],
        "final_risk_score": result["final_risk_score"],
        "signals": {
            "nlp": result["nlp"],
            "nsfw": result["nsfw"],
            "clip": result["clip"],
            "ocr": result["ocr"],
        },
    }