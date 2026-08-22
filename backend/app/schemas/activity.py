"""
Activity Pydantic Schemas
"""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ActivityBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = None
    category: str = Field(..., max_length=50, description="Activity category (e.g. sightseeing, adventure, food, culture)")
    duration_minutes: int = Field(..., gt=0, description="Duration in minutes (must be > 0)")
    estimated_cost: Decimal = Field(default=Decimal("0.0"), ge=0, description="Cost in currency (must be >= 0)")
    currency: str = Field(default="INR", max_length=3)
    rating: float = Field(default=0.0, ge=0.0, le=5.0, description="Rating from 0.0 to 5.0")
    image_url: Optional[str] = Field(None, max_length=500)
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None


class ActivityCreate(ActivityBase):
    city_id: int = Field(..., description="ID of city where activity takes place")


class ActivityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=50)
    duration_minutes: Optional[int] = Field(None, gt=0)
    estimated_cost: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
    rating: Optional[float] = Field(None, ge=0.0, le=5.0)
    image_url: Optional[str] = Field(None, max_length=500)
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None


class ActivityResponse(ActivityBase):
    id: int
    city_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
