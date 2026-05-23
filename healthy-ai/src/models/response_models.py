from pydantic import BaseModel
from typing import Dict, Any


class RecommendationResponse(BaseModel):

    success: bool
    source: str
    meal: Dict[str, Any]


class AnalysisResponse(BaseModel):

    status: str
    food: str
    analysis: Dict[str, Any]