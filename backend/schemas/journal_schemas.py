from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Any

class EmotionItem(BaseModel):
    label: str
    score: float

class EntryIn(BaseModel):
    user_id: str = Field(..., example="user_1")
    emoji: str = Field(..., example="Down")
    text: Optional[str] = Field(None)
    timestamp: Optional[datetime] = None

class EntryOut(BaseModel):
    id: Any
    user_id: str
    timestamp: datetime
    emoji: str
    emoji_score: float
    text: Optional[str]
    top_emotions: List[EmotionItem]
    text_polarity: float
    weighted_mood: float
    z_score: float
    cusum: float
    mood_decline: bool