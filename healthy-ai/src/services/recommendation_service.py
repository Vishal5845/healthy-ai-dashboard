from src.ai.gemini_client import FoodAIClient
from src.services.storage_service import (
    storage_service
)

class RecommendationService:
    def __init__(self):
        self.ai_client = FoodAIClient()
    def get_recommendation(
        self,
        dietary_needs: str,
        calories: int,
        user_id: str = "default"
    ):
        # user_id reserved for future DB/history logic
        recommendation = (
            self.ai_client.get_recommendation(
                dietary_needs,
                calories
            )
        )
        storage_service.save_recommendation(
            dietary_needs=dietary_needs,
            calories=calories,
            recommendation=recommendation,
            user_id=user_id
        )

        return recommendation

# Singleton instance
_service = RecommendationService()

def get_recommendation_service():
    return _service