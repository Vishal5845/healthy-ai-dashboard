# src/services/analysis_service.py

from src.ai.gemini_client import FoodAIClient

ai_client = FoodAIClient()


def analyze_food_service(food_description: str):
    return ai_client.analyze_nutrition(food_description)