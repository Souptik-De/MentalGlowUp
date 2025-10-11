from fastapi import APIRouter, HTTPException
from app.schemas.mood import MoodEntryIn, MoodEntryOut
from app.services.mood_service import MoodService

router = APIRouter()

@router.post("/submit", response_model=MoodEntryOut)
async def submit_mood_entry(payload: MoodEntryIn):
    """Submit a new mood entry"""
    service = MoodService()
    return await service.create_entry(payload)

@router.get("/{user_id}/latest")
async def get_latest_mood(user_id: str):
    """Get user's latest mood entry"""
    service = MoodService()
    return await service.get_latest(user_id)