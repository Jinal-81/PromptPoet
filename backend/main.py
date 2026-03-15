import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import engine, Base
from routes.poem import router as poem_router
from dotenv import load_dotenv

load_dotenv()

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PromptPoet API",
    description="Backend API for AI Poem Generator",
    version="1.0.0"
)

# Enable CORS (allow all origins for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(poem_router, prefix="/api", tags=["Poems"])

@app.get("/")
def read_root():
    return {"message": "Welcome to PromptPoet API!"}
