from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db, close_db
from app.api.v1.router import api_router
from app.services.emotion_analyzer import init_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await init_model()
    yield
    # Shutdown
    await close_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Serve frontend (optional)
if settings.SERVE_FRONTEND:
    app.mount("/static", StaticFiles(directory="../frontend/dist"), name="static")