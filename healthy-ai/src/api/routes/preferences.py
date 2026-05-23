from fastapi import APIRouter

preferences_router = APIRouter(
    prefix="/api",
    tags=["Preferences"]
)
user_preferences = {}
@preferences_router.post("/preferences")
async def set_preferences(data: dict):
    global user_preferences
    user_preferences = data
    return {
        "success": True,
        "preferences": user_preferences
    }
@preferences_router.get("/preferences")
async def get_preferences():
    return {
        "success": True,
        "preferences": user_preferences
    }