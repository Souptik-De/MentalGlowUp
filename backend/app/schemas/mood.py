from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class EmotionItem(BaseModel):
    label: str
    score: float

class MoodEntryIn(BaseModel):
    user_id: str = Field(..., example="user_1")
    emoji: str = Field(..., example="Down")
    text: Optional[str] = Field(None, example="I had a rough day...")
    timestamp: Optional[datetime] = None

class MoodEntryOut(BaseModel):
    id: str
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