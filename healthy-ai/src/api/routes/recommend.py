from fastapi import APIRouter, HTTPException
from src.models.request_models import RecommendationRequest
from src.models.response_models import RecommendationResponse
from src.services.recommendation_service import (
    get_recommendation_service
)
recommend_router = APIRouter(
    prefix="/api",
    tags=["Recommendations"]
)
@recommend_router.post(
    "/recommend",
    response_model=RecommendationResponse
)
async def recommend_food(
    request: RecommendationRequest
):
    try:
        if request.calories <= 0:
            raise HTTPException(
                status_code=400,
                detail="Calories must be positive"
            )
        service = get_recommendation_service()
        result = service.get_recommendation(
            request.dietary_needs,
            request.calories
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )