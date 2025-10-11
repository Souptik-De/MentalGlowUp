from datetime import datetime
from app.database import get_database
from app.schemas.mood import MoodEntryIn, MoodEntryOut
from app.services.emotion_analyzer import analyze_emotion
from app.services.analytics import compute_mood_metrics
from app.core.constants import EMOJI_MAP

class MoodService:
    def __init__(self):
        self.db = get_database()
        
    async def create_entry(self, payload: MoodEntryIn) -> MoodEntryOut:
        """Create a new mood entry"""
        
        # Validate emoji
        if payload.emoji not in EMOJI_MAP:
            raise ValueError("Invalid emoji")
        
        # Get emoji score
        emoji_score = EMOJI_MAP[payload.emoji]
        
        # Analyze text if provided
        emotions = []
        text_polarity = 0.0
        if payload.text:
            emotions = await analyze_emotion(payload.text)
            text_polarity = self._compute_polarity(emotions)
        
        # Calculate weighted mood
        weighted_mood = self._calculate_weighted_mood(emoji_score, text_polarity)
        
        # Get metrics
        metrics = await compute_mood_metrics(payload.user_id, weighted_mood)
        
        # Prepare document
        doc = {
            "user_id": payload.user_id,
            "timestamp": payload.timestamp or datetime.utcnow(),
            "emoji": payload.emoji,
            "emoji_score": emoji_score,
            "text": payload.text or "",
            "top_emotions": [{"label": e.label, "score": e.score} for e in emotions],
            "text_polarity": text_polarity,
            "weighted_mood": weighted_mood,
            **metrics
        }
        
        # Insert to database
        result = await self.db.journals.insert_one(doc)
        
        return MoodEntryOut(id=str(result.inserted_id), **doc, top_emotions=emotions)
    
    def _calculate_weighted_mood(self, emoji_score: float, text_polarity: float) -> float:
        from app.config import settings
        return settings.ALPHA * emoji_score + (1 - settings.ALPHA) * text_polarity
    
    def _compute_polarity(self, emotions) -> float:
        # Implementation from your original code
        pass