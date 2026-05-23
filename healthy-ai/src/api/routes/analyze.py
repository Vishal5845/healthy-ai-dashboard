from fastapi import APIRouter, HTTPException

from src.models.request_models import AnalysisRequest
from src.services.analysis_service import (
    analyze_food_service
)

analyze_router = APIRouter(
    prefix="/api",
    tags=["Analysis"]
)


@analyze_router.post("/analyze")
def analyze_food(
    request: AnalysisRequest
):

    try:

        result = analyze_food_service(
            request.food_description
        )

        return {
            "status": "success",
            "food": request.food_description,
            "analysis": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )