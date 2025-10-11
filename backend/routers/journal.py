from fastapi import APIRouter
from schemas.journal_schemas import EntryIn, EntryOut
from crud.journal_crud import create_mood_entry, get_user_progress

router = APIRouter()

@router.post("/submit_entry", response_model=EntryOut)
async def submit_entry(payload: EntryIn):
    return await create_mood_entry(payload)

@router.get("/get_progress/{user_id}")
async def get_progress(user_id: str, limit: int = 100):
    return await get_user_progress(user_id, limit)