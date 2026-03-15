from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.poem_model import Poem, PoemCreate, PoemResponse
from services.ai_service import generate_poem_from_ai
from typing import List

router = APIRouter()

@router.post("/generate-poem", response_model=PoemResponse)
async def generate_poem(request: PoemCreate, db: Session = Depends(get_db)):
    try:
        # Generate poem via AI
        generated_content = await generate_poem_from_ai(
            prompt=request.prompt,
            style=request.style,
            mood=request.mood
        )
        
        # Save to database
        new_poem = Poem(
            prompt=request.prompt,
            style=request.style,
            mood=request.mood,
            content=generated_content
        )
        db.add(new_poem)
        db.commit()
        db.refresh(new_poem)
        
        return new_poem
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate poem: {str(e)}")

@router.get("/poems", response_model=List[PoemResponse])
def get_poems(limit: int = 50, db: Session = Depends(get_db)):
    poems = db.query(Poem).order_by(Poem.created_at.desc()).limit(limit).all()
    return poems
