"""
ItineraryItem Pydantic Schemas
"""

from datetime import date, datetime, time
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.activity import ActivityResponse


class ItineraryItemBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = None
    date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    item_type: str = Field(default="activity", description="Type: 'travel', 'activity', 'meal', 'hotel', 'other'")
    item_order: int = Field(default=1, gt=0)
    estimated_cost: Decimal = Field(default=Decimal("0.0"), ge=0)


class ItineraryItemCreate(ItineraryItemBase):
    activity_id: Optional[int] = None
    trip_stop_id: Optional[int] = None


class ItineraryItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    item_type: Optional[str] = None
    item_order: Optional[int] = Field(None, gt=0)
    estimated_cost: Optional[Decimal] = Field(None, ge=0)
    activity_id: Optional[int] = None
    trip_stop_id: Optional[int] = None


class ItineraryItemResponse(ItineraryItemBase):
    id: int
    trip_id: int
    activity_id: Optional[int] = None
    trip_stop_id: Optional[int] = None
    activity: Optional[ActivityResponse] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ItineraryReorderRequest(BaseModel):
    item_ids: List[int] = Field(..., min_length=1, description="Ordered list of itinerary item IDs")
