"""
City Pydantic Schemas
"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.activity import ActivityResponse


class CityBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    country: str = Field(..., min_length=2, max_length=100)
    region: Optional[str] = Field(None, max_length=100)
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    description: Optional[str] = None
    cost_index: int = Field(default=1, ge=0, description="Relative cost index (>= 0)")
    popularity: float = Field(default=0.0, ge=0.0, le=5.0, description="Popularity score from 0.0 to 5.0")
    best_time_to_visit: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)


class CityCreate(CityBase):
    pass


class CityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    country: Optional[str] = Field(None, min_length=2, max_length=100)
    region: Optional[str] = Field(None, max_length=100)
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    description: Optional[str] = None
    cost_index: Optional[int] = Field(None, ge=0)
    popularity: Optional[float] = Field(None, ge=0.0, le=5.0)
    best_time_to_visit: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)


class CityResponse(CityBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CityDetailResponse(CityResponse):
    activities: List[ActivityResponse] = []

    model_config = ConfigDict(from_attributes=True)
