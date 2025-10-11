from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.goals import router as goals_router
from routers.journal import router as journal_router
app = FastAPI(title="Unified Mental Health App API")


origins = ["http://localhost:8080", "http://127.0.0.1:8080"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(goals_router) 
app.include_router(journal_router)
