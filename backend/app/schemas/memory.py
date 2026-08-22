"""
Memory Pydantic Schemas
"""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class MemoryBase(BaseModel):
    image_url: str = Field(..., min_length=5, max_length=500)
    caption: Optional[str] = None
    location: Optional[str] = Field(None, max_length=150)
    memory_date: Optional[date] = None


class MemoryCreate(MemoryBase):
    trip_id: Optional[int] = None


class MemoryUpdate(BaseModel):
    image_url: Optional[str] = Field(None, min_length=5, max_length=500)
    caption: Optional[str] = None
    location: Optional[str] = Field(None, max_length=150)
    memory_date: Optional[date] = None
    trip_id: Optional[int] = None


class MemoryResponse(MemoryBase):
    id: int
    user_id: int
    trip_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
