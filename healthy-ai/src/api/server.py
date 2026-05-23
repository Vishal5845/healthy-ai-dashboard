"""FastAPI server for Healthy Food AI"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
from src.models.response_models import (
    RecommendationResponse,
    AnalysisResponse
)

from src.services.recommendation_service import (
    get_recommendation_service
)

from src.services.analysis_service import (
    analyze_food_service
)

from src.db.database import get_db

from src.models.request_models import (
    RecommendationRequest,
    AnalysisRequest,
    PreferencesRequest
)

from src.api.routes.health import (
    router as health_router
)
from src.api.routes.history import (
    router as history_router
)

# ================= SETUP ================= #

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Healthy Food AI API",
    description="AI-powered nutrition recommendation API",
    version="1.0.0"
)

# ================= CORS ================= #

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROOT ================= #

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "Healthy Food AI API is running"
    }

# ================= HEALTH ================= #

app.include_router(
    health_router,
    prefix="/api"
)

app.include_router(
    history_router,
    prefix="/api"
)

# ================= RECOMMEND ================= #

@app.post(
    "/api/recommend",
    response_model=RecommendationResponse
)
def get_recommendation(
    request: RecommendationRequest
):

    try:

        service = get_recommendation_service()

        recommendation = service.get_recommendation(
            request.dietary_needs,
            request.calories,
            request.user_id
        )
        db = get_db()
        
        if db:
            db.save_recommendation(
                request.user_id,
                request.dietary_needs,
                request.calories,
                recommendation
            )

        return recommendation

    except Exception as e:

        logger.error(
            f"Recommendation error: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ================= ANALYZE ================= #

@app.post("/api/analyze",response_model=AnalysisResponse)
def analyze_nutrition(
    request: AnalysisRequest
):

    try:

        analysis = analyze_food_service(
            request.food_description
        )

        return {
            "status": "success",
            "food": request.food_description,
            "analysis": analysis
        }

    except Exception as e:

        logger.error(
            f"Analysis error: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ================= HISTORY ================= #

@app.get("/api/recommendations/{user_id}")
def get_user_recommendations(
    user_id: str,
    limit: int = 10
):

    try:

        db = get_db()

        recommendations = []

        if db:
            recommendations = db.get_recommendations(
                user_id,
                limit
            )

        return {
            "status": "success",
            "user_id": user_id,
            "count": len(recommendations),
            "recommendations": [
                {
                    "id": str(r.get("_id")),
                    "dietary_needs": r.get("dietary_needs"),
                    "calories": r.get("calories"),
                    "recommendation": r.get("recommendation"),
                    "timestamp": r.get("timestamp")
                }
                for r in recommendations
            ]
        }

    except Exception as e:

        logger.error(
            f"History error: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ================= PREFERENCES ================= #

@app.post("/api/preferences")
def save_preferences(
    request: PreferencesRequest
):

    try:

        import json

        db = get_db()

        success = False

        prefs_data = {
            "user_id": request.user_id,
            "dietary_needs": request.dietary_needs,
            "target_calories": request.target_calories,
            "allergies": request.allergies
        }

        # Save to MongoDB if available
        if db:

            success = db.save_preferences(
                request.user_id,
                request.dietary_needs,
                request.target_calories,
                request.allergies
            )

        # MongoDB success
        if success:

            return {
                "status": "success",
                "message": (
                    f"Preferences saved for "
                    f"{request.user_id}"
                )
            }

        # Local JSON fallback
        with open(
            "user_preferences.json",
            "w"
        ) as f:

            json.dump(
                prefs_data,
                f,
                indent=2
            )

        return {
            "status": "warning",
            "message": (
                "Preferences saved locally "
                "(MongoDB not available)"
            )
        }

    except Exception as e:

        logger.error(
            f"Preferences save error: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.get("/api/preferences/{user_id}")
def get_user_preferences(
    user_id: str
):

    try:

        import json
        from pathlib import Path

        db = get_db()

        prefs = None

        # MongoDB lookup
        if db:
            prefs = db.get_preferences(user_id)

        # Local fallback
        if not prefs:

            prefs_file = Path(
                "user_preferences.json"
            )

            if prefs_file.exists():

                with open(prefs_file) as f:
                    prefs = json.load(f)

        # Still nothing found
        if not prefs:

            raise HTTPException(
                status_code=404,
                detail=(
                    f"No preferences found "
                    f"for {user_id}"
                )
            )

        return {
            "status": "success",
            "user_id": prefs.get("user_id"),
            "dietary_needs": prefs.get(
                "dietary_needs"
            ),
            "target_calories": prefs.get(
                "target_calories"
            ),
            "allergies": prefs.get(
                "allergies"
            )
        }

    except HTTPException:
        raise

    except Exception as e:

        logger.error(
            f"Preferences fetch error: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )