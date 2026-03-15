from sqlalchemy import Column, Integer, String, Text, DateTime
from database.db import Base
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict
from typing import Optional

# SQLAlchemy Model
class Poem(Base):
    __tablename__ = "poems"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(String, index=True)
    style = Column(String)
    mood = Column(String, nullable=True)
    content = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# Pydantic Schemas
class PoemCreate(BaseModel):
    prompt: str
    style: str
    mood: Optional[str] = None

class PoemResponse(BaseModel):
    id: int
    prompt: str
    style: str
    mood: Optional[str] = None
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
