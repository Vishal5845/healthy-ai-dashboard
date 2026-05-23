from fastapi import (
    APIRouter,
    HTTPException
)

from src.services.storage_service import (
    storage_service
)

router = APIRouter()

@router.get("/history/{user_id}")
async def get_history(
    user_id: str
):
    history = (
        storage_service
        .get_user_history(user_id)
    )
    return {
        "success": True,
        "history": history
    }

@router.delete("/history/{item_id}")
async def delete_history_item(
    item_id: str
):
    deleted = (
        storage_service
        .delete_recommendation(item_id)
    )
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="History item not found"
        )
    return {
        "success": True
    }