"""
Public Shared Trip Pydantic Schemas
"""

from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.city import CityResponse
from app.schemas.itinerary import ItineraryItemResponse
from app.schemas.expense import BudgetSummaryResponse


class SharedTripStopResponse(BaseModel):
    id: int
    city_id: int
    arrival_date: date
    departure_date: date
    stop_order: int
    city: Optional[CityResponse] = None

    model_config = ConfigDict(from_attributes=True)


class SharedTripResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    budget: Decimal
    currency: str
    status: str
    cover_image: Optional[str] = None
    share_id: str
    is_public: bool
    owner_name: str
    created_at: datetime
    trip_stops: List[SharedTripStopResponse] = []
    itinerary_items: List[ItineraryItemResponse] = []
    budget_summary: Optional[BudgetSummaryResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ShareTripEnableResponse(BaseModel):
    trip_id: int
    share_id: str
    share_url: str
    is_public: bool
