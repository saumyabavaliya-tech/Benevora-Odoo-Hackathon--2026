"""
Trips & Stops Router
Endpoints for managing multi-city trips, destinations, stops, and public trip sharing.
"""

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.city import City
from app.models.trip import Trip, TripStop
from app.models.user import User
from app.schemas.shared import ShareTripEnableResponse
from app.schemas.trip import (
    TripCreate,
    TripDetailResponse,
    TripResponse,
    TripStopCreate,
    TripStopResponse,
    TripStopUpdate,
    TripUpdate,
)

router = APIRouter(tags=["Trips & Stops"])


# =====================================================================
# HELPER AUTH FUNCTION
# =====================================================================

def get_user_trip_or_403(trip_id: int, user_id: int, db: Session) -> Trip:
    """
    Retrieve trip by ID and ensure it belongs to the authenticated user.
    
    :raises HTTPException 404: If trip does not exist.
    :raises HTTPException 403: If trip belongs to a different user.
    """
    trip = db.get(Trip, trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found.",
        )
    if trip.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access or modify this trip.",
        )
    return trip


# =====================================================================
# TRIP ENDPOINTS (/api/trips)
# =====================================================================

@router.post(
    "/api/trips",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new trip",
    description="Creates a new trip belonging to the authenticated user.",
)
def create_trip(
    trip_in: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_trip = Trip(
        user_id=current_user.id,
        name=trip_in.name.strip(),
        description=trip_in.description,
        start_date=trip_in.start_date,
        end_date=trip_in.end_date,
        budget=trip_in.budget,
        currency=trip_in.currency,
        status=trip_in.status,
        cover_image=trip_in.cover_image,
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip


@router.get(
    "/api/trips",
    response_model=List[TripResponse],
    status_code=status.HTTP_200_OK,
    summary="List authenticated user's trips",
    description="Returns only the trips created by the currently authenticated user.",
)
def list_my_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trips = (
        db.query(Trip)
        .filter(Trip.user_id == current_user.id)
        .order_by(Trip.start_date.asc())
        .all()
    )
    return trips


@router.get(
    "/api/trips/{trip_id}",
    response_model=TripDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single trip details",
    description="Returns full trip details including stops, itinerary items, expenses, and memories. Verifies ownership.",
)
def get_trip_detail(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)
    return trip


@router.put(
    "/api/trips/{trip_id}",
    response_model=TripResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a trip",
    description="Updates trip parameters (name, dates, budget, status, cover image). Verifies ownership.",
)
def update_trip(
    trip_id: int,
    trip_update: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)

    update_data = trip_update.model_dump(exclude_unset=True)

    # Validate updated dates if provided
    new_start = update_data.get("start_date", trip.start_date)
    new_end = update_data.get("end_date", trip.end_date)
    if new_end < new_start:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Trip end_date cannot be earlier than start_date.",
        )

    for field, val in update_data.items():
        setattr(trip, field, val)

    db.commit()
    db.refresh(trip)
    return trip


@router.delete(
    "/api/trips/{trip_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a trip",
    description="Deletes a trip and cascades removal to all associated stops, itinerary items, expenses, and memories.",
)
def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)
    db.delete(trip)
    db.commit()
    return None


@router.post(
    "/api/trips/{trip_id}/share",
    response_model=ShareTripEnableResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate or retrieve public sharing link for a trip",
    description="Enables public view for the trip and generates a secure random URL-safe share token.",
)
def share_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)

    if not trip.share_id:
        trip.share_id = uuid.uuid4().hex[:16]
    trip.is_public = True

    db.commit()
    db.refresh(trip)

    return ShareTripEnableResponse(
        trip_id=trip.id,
        share_id=trip.share_id,
        share_url=f"/shared/{trip.share_id}",
        is_public=trip.is_public,
    )


# =====================================================================
# TRIP STOPS ENDPOINTS (/api/trips/{trip_id}/stops & /api/stops/{stop_id})
# =====================================================================

@router.get(
    "/api/trips/{trip_id}/stops",
    response_model=List[TripStopResponse],
    status_code=status.HTTP_200_OK,
    summary="List stops for a trip",
    description="Returns all destination stops for a trip ordered by stop_order.",
)
def list_trip_stops(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)
    stops = (
        db.query(TripStop)
        .filter(TripStop.trip_id == trip.id)
        .order_by(TripStop.stop_order.asc())
        .all()
    )
    return stops


@router.post(
    "/api/trips/{trip_id}/stops",
    response_model=TripStopResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a city stop to a trip",
    description="Adds a destination city stop with arrival/departure dates and order index. Verifies trip ownership.",
)
def create_trip_stop(
    trip_id: int,
    stop_in: TripStopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)

    # Verify city exists
    city = db.get(City, stop_in.city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with ID {stop_in.city_id} not found.",
        )

    # Check for duplicate stop_order on this trip
    existing_order = (
        db.query(TripStop)
        .filter(TripStop.trip_id == trip.id, TripStop.stop_order == stop_in.stop_order)
        .first()
    )
    if existing_order:
        # Auto-shift stop_orders if needed, or adjust
        max_order = (
            db.query(TripStop)
            .filter(TripStop.trip_id == trip.id)
            .count()
        )
        stop_in.stop_order = max_order + 1

    new_stop = TripStop(
        trip_id=trip.id,
        city_id=stop_in.city_id,
        arrival_date=stop_in.arrival_date,
        departure_date=stop_in.departure_date,
        stop_order=stop_in.stop_order,
    )
    db.add(new_stop)
    db.commit()
    db.refresh(new_stop)
    return new_stop


@router.put(
    "/api/stops/{stop_id}",
    response_model=TripStopResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a trip stop",
    description="Updates arrival/departure dates or stop order. Verifies ownership of parent trip.",
)
def update_trip_stop(
    stop_id: int,
    stop_update: TripStopUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stop = db.get(TripStop, stop_id)
    if not stop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip stop with ID {stop_id} not found.",
        )
    # Check parent trip ownership
    get_user_trip_or_403(stop.trip_id, current_user.id, db)

    update_data = stop_update.model_dump(exclude_unset=True)

    if "city_id" in update_data and update_data["city_id"] is not None:
        city = db.get(City, update_data["city_id"])
        if not city:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"City with ID {update_data['city_id']} not found.",
            )

    new_arr = update_data.get("arrival_date", stop.arrival_date)
    new_dep = update_data.get("departure_date", stop.departure_date)
    if new_dep < new_arr:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Stop departure_date cannot be earlier than arrival_date.",
        )

    for field, val in update_data.items():
        setattr(stop, field, val)

    db.commit()
    db.refresh(stop)
    return stop


@router.delete(
    "/api/stops/{stop_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a trip stop",
    description="Removes a destination stop from a trip. Verifies parent trip ownership.",
)
def delete_trip_stop(
    stop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stop = db.get(TripStop, stop_id)
    if not stop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip stop with ID {stop_id} not found.",
        )
    get_user_trip_or_403(stop.trip_id, current_user.id, db)

    db.delete(stop)
    db.commit()
    return None
