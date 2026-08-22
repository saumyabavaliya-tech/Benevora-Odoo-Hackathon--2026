"""
Trip and TripStop Pydantic Schemas
"""

from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator
from app.schemas.city import CityResponse
from app.schemas.itinerary import ItineraryItemResponse
from app.schemas.expense import ExpenseResponse
from app.schemas.memory import MemoryResponse


# --- TRIP STOP SCHEMAS ---

class TripStopBase(BaseModel):
    city_id: int
    arrival_date: date
    departure_date: date
    stop_order: int = Field(..., gt=0)

    @model_validator(mode="after")
    def check_dates(self):
        if self.departure_date < self.arrival_date:
            raise ValueError("departure_date must be on or after arrival_date")
        return self


class TripStopCreate(TripStopBase):
    pass


class TripStopUpdate(BaseModel):
    city_id: Optional[int] = None
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    stop_order: Optional[int] = Field(None, gt=0)


class TripStopResponse(TripStopBase):
    id: int
    trip_id: int
    city: Optional[CityResponse] = None

    model_config = ConfigDict(from_attributes=True)


# --- TRIP SCHEMAS ---

class TripBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = None
    start_date: date
    end_date: date
    budget: Decimal = Field(default=Decimal("0.0"), ge=0)
    currency: str = Field(default="INR", max_length=3)
    status: str = Field(default="draft", description="'draft', 'upcoming', 'ongoing', 'completed'")
    cover_image: Optional[str] = Field(None, max_length=500)

    @model_validator(mode="after")
    def check_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date")
        return self


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
    status: Optional[str] = None
    cover_image: Optional[str] = Field(None, max_length=500)


class TripResponse(TripBase):
    id: int
    user_id: int
    share_id: Optional[str] = None
    is_public: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TripDetailResponse(TripResponse):
    trip_stops: List[TripStopResponse] = []
    itinerary_items: List[ItineraryItemResponse] = []
    expenses: List[ExpenseResponse] = []
    memories: List[MemoryResponse] = []

    model_config = ConfigDict(from_attributes=True)
