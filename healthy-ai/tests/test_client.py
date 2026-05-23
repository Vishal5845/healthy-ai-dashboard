import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from src.ai.gemini_client import FoodAIClient

client = FoodAIClient()

try:
    res = client.get_recommendation("vegetarian", 2000)
    
    print("✅ SUCCESS")
    print("Type:", type(res))
    print("Response:", res)

except Exception as e:
    print("❌ ERROR:", e)