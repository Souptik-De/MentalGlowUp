from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "MindfulMe API"
    VERSION: str = "1.0.0"
    
    # Database
    MONGODB_URI: str
    DB_NAME: str = "mindfulme"
    
    # ML Model
    EMOTION_MODEL: str = "SamLowe/roberta-base-go_emotions"
    
    # Mood Analysis
    ALPHA: float = 0.3
    WINDOW: int = 10
    CUSUM_K: float = 0.1
    CUSUM_H: float = 0.8
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"]
    
    # Frontend
    SERVE_FRONTEND: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()