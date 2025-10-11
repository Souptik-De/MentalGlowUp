from fastapi import APIRouter
from app.api.v1.endpoints import mood, journal, progress, breathing, goals, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(mood.router, prefix="/mood", tags=["mood"])
api_router.include_router(journal.router, prefix="/journal", tags=["journal"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(breathing.router, prefix="/breathing", tags=["breathing"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])