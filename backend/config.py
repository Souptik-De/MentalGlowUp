# backend/config.py

EMOJI_MAP = {
    "Amazing": 1.0,
    "Good": 0.5,
    "Okay": 0.0,
    "Down": -0.5,
    "Stressed": -1.0
}

POSITIVE_LABELS = {
    "joy", "admiration", "relief", "love", "optimism", "pride", "gratitude"
}

NEGATIVE_LABELS = {
    "sadness", "anger", "fear", "disgust", "grief", "remorse", "disappointment",
    "embarrassment", "nervousness", "annoyance", "worry"
}

ALPHA = 0.3
WINDOW = 10
CUSUM_K = 0.1
CUSUM_H = 0.8