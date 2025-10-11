from datetime import datetime
from fastapi import HTTPException
import numpy as np
import asyncio
from typing import Dict, List
from transformers import pipeline
from database import get_db
from schemas.journal_schemas import EntryIn, EntryOut, EmotionItem
from config import EMOJI_MAP, ALPHA, WINDOW, POSITIVE_LABELS, NEGATIVE_LABELS

# Model initialization
MODEL_PIPELINE = None

async def init_emotion_model():
    """Call this from main.py startup"""
    global MODEL_PIPELINE
    MODEL_PIPELINE = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions", top_k=None)
    await asyncio.to_thread(MODEL_PIPELINE, "warmup")

async def analyze_text(text: str) -> Dict[str, float]:
    if MODEL_PIPELINE is None:
        return {}
    result = await asyncio.to_thread(MODEL_PIPELINE, text, top_k=None)
    if isinstance(result, list) and result:
        result = result[0] if isinstance(result[0], list) else result
        return {p["label"]: float(p["score"]) for p in result}
    return {}

def compute_text_polarity(scores: Dict[str, float]) -> float:
    if not scores:
        return 0.0
    pos = sum(scores.get(k, 0.0) for k in POSITIVE_LABELS)
    neg = sum(scores.get(k, 0.0) for k in NEGATIVE_LABELS)
    total = pos + neg
    return float(np.clip((pos - neg) / total, -1.0, 1.0)) if total else 0.0

def compute_z_score(latest: float, window_values: List[float]) -> float:
    if not window_values:
        return 0.0
    arr = np.array(window_values)
    mu, sigma = arr.mean(), arr.std(ddof=0)
    return float((latest - mu) / sigma) if sigma else 0.0

def compute_cusum(series: List[float], baseline_mean: float, k: float = 0.1) -> float:
    S = 0.0
    for x in series:
        S = max(0.0, S + (baseline_mean - x - k))
    return float(S)

def top_k_emotions(scores: Dict[str, float], k: int = 5) -> List[EmotionItem]:
    items = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k]
    return [EmotionItem(label=l, score=float(s)) for l, s in items]

def emotion_items_to_dicts(emotions: List[EmotionItem]) -> List[Dict]:
    return [{"label": e.label, "score": e.score} for e in emotions]

def dicts_to_emotion_items(dicts: List[Dict]) -> List[EmotionItem]:
    return [EmotionItem(**e) for e in dicts]

# Main CRUD functions
async def create_mood_entry(payload: EntryIn) -> EntryOut:
    db = get_db()
    
    if payload.emoji not in EMOJI_MAP:
        raise HTTPException(status_code=400, detail="Unknown emoji label")

    ts = payload.timestamp or datetime.utcnow()
    emoji_score = EMOJI_MAP[payload.emoji]
    text = payload.text.strip() if payload.text else ""

    scores = {}
    text_polarity = 0.0
    if text:
        scores = await analyze_text(text)
        text_polarity = compute_text_polarity(scores)

    weighted_mood = ALPHA * emoji_score + (1 - ALPHA) * text_polarity

    cursor = db.journals.find(
        {"user_id": payload.user_id},
        projection={"weighted_mood": 1}
    ).sort("timestamp", -1).limit(WINDOW - 1)
    last_docs = await cursor.to_list(length=WINDOW - 1)
    last_moods = [d["weighted_mood"] for d in reversed(last_docs)]

    z = compute_z_score(weighted_mood, last_moods)

    baseline_cursor = db.journals.find(
        {"user_id": payload.user_id},
        projection={"weighted_mood": 1}
    ).sort("timestamp", -1).limit(50)
    baseline_docs = await baseline_cursor.to_list(length=50)
    baseline_moods = [d["weighted_mood"] for d in reversed(baseline_docs)]
    
    baseline_mean = float(np.mean(baseline_moods)) if baseline_moods else weighted_mood
    cusum = compute_cusum(baseline_moods + [weighted_mood], baseline_mean)
    mood_decline = (z < -1.5) or (cusum > 0.8)

    emotion_items = top_k_emotions(scores)
    emotion_dicts = emotion_items_to_dicts(emotion_items)

    doc = {
        "user_id": payload.user_id,
        "timestamp": ts,
        "emoji": payload.emoji,
        "emoji_score": emoji_score,
        "text": text,
        "top_emotions": emotion_dicts,
        "text_polarity": text_polarity,
        "weighted_mood": weighted_mood,
        "z_score": z,
        "cusum": cusum,
        "mood_decline": mood_decline
    }

    result = await db.journals.insert_one(doc)
    return EntryOut(id=str(result.inserted_id), **doc, top_emotions=emotion_items)

async def get_user_progress(user_id: str, limit: int):
    db = get_db()
    cursor = db.journals.find({"user_id": user_id}).sort("timestamp", 1).limit(limit)
    items = await cursor.to_list(length=limit)
    
    series = []
    for item in items:
        emotion_items = dicts_to_emotion_items(item.get("top_emotions", []))
        series.append({
            "timestamp": item["timestamp"].isoformat(),
            "weighted_mood": item["weighted_mood"],
            "emoji": item["emoji"],
            "top_emotions": emotion_items,
            "mood_decline": item.get("mood_decline", False),
            "z_score": item.get("z_score", 0.0),
            "cusum": item.get("cusum", 0.0),
        })
    
    return {"user_id": user_id, "series": series}