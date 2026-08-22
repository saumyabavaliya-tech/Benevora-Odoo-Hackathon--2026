"""
Public Shared Trip Router
Endpoints for public, read-only viewing of shared trips without exposing private user data.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.trip import Trip
from app.schemas.shared import SharedTripResponse
from app.services.budget import calculate_budget_summary

router = APIRouter(prefix="/api/shared", tags=["Public Shared Trips"])


@router.get(
    "/{share_id}",
    response_model=SharedTripResponse,
    status_code=status.HTTP_200_OK,
    summary="View a public shared trip",
    description="Returns a read-only view of a public trip (name, itinerary, stops, activities, and budget summary). No private account data is exposed.",
)
def get_shared_trip(
    share_id: str,
    db: Session = Depends(get_db)
):
    trip = (
        db.query(Trip)
        .filter(Trip.share_id == share_id.strip(), Trip.is_public.is_(True))
        .first()
    )
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shared trip not found or is no longer public.",
        )

    budget_summary = calculate_budget_summary(trip, db)
    owner_name = trip.user.name if trip.user else "GlobeTrotter Explorer"

    return SharedTripResponse(
        id=trip.id,
        name=trip.name,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        budget=trip.budget,
        currency=trip.currency,
        status=trip.status,
        cover_image=trip.cover_image,
        share_id=trip.share_id or share_id,
        is_public=trip.is_public,
        owner_name=owner_name,
        created_at=trip.created_at,
        trip_stops=trip.trip_stops,
        itinerary_items=trip.itinerary_items,
        budget_summary=budget_summary,
    )
