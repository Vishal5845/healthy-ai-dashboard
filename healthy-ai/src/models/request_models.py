from pydantic import BaseModel, Field
from typing import List, Literal


class RecommendationRequest(BaseModel):
    dietary_needs: Literal[
        "veg",
        "non-veg",
        "vegan",
        "keto",
        "high-protein"
    ]
    calories: int = Field(
        ge=200,
        le=2000
    )
    user_id: str = "default"


class AnalysisRequest(BaseModel):
    food_description: str = Field(
        min_length=3,
        max_length=500
    )


class PreferencesRequest(BaseModel):
    user_id: str = "default"
    dietary_needs: List[str]
    target_calories: int = Field(
        ge=200,
        le=4000
    )
    allergies: List[str] = []