"""
Itinerary Router
Endpoints for managing timeline items, activities, meals, transit, and drag-and-drop reordering.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.activity import Activity
from app.models.itinerary import ItineraryItem
from app.models.trip import Trip, TripStop
from app.models.user import User
from app.routers.trips import get_user_trip_or_403
from app.schemas.itinerary import (
    ItineraryItemCreate,
    ItineraryItemResponse,
    ItineraryItemUpdate,
    ItineraryReorderRequest,
)

router = APIRouter(tags=["Itinerary"])


@router.get(
    "/api/trips/{trip_id}/itinerary",
    response_model=List[ItineraryItemResponse],
    status_code=status.HTTP_200_OK,
    summary="Get itinerary for a trip",
    description="Returns all scheduled itinerary items for a trip sorted by date, item order, and start time.",
)
def get_trip_itinerary(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)
    items = (
        db.query(ItineraryItem)
        .filter(ItineraryItem.trip_id == trip.id)
        .order_by(
            ItineraryItem.date.asc(),
            ItineraryItem.item_order.asc(),
            ItineraryItem.start_time.asc()
        )
        .all()
    )
    return items


@router.post(
    "/api/trips/{trip_id}/itinerary",
    response_model=ItineraryItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add an itinerary item to a trip",
    description="Creates a new activity, meal, hotel, transit, or custom schedule item for the trip. Verifies ownership.",
)
def create_itinerary_item(
    trip_id: int,
    item_in: ItineraryItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)

    # Validate activity if passed
    if item_in.activity_id:
        act = db.get(Activity, item_in.activity_id)
        if not act:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Activity with ID {item_in.activity_id} not found.",
            )

    # Validate trip stop if passed
    if item_in.trip_stop_id:
        stop = db.get(TripStop, item_in.trip_stop_id)
        if not stop or stop.trip_id != trip.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Trip stop with ID {item_in.trip_stop_id} does not belong to this trip.",
            )

    # Determine default item_order if not provided
    if not item_in.item_order:
        current_count = (
            db.query(ItineraryItem)
            .filter(ItineraryItem.trip_id == trip.id, ItineraryItem.date == item_in.date)
            .count()
        )
        item_in.item_order = current_count + 1

    new_item = ItineraryItem(
        trip_id=trip.id,
        activity_id=item_in.activity_id,
        trip_stop_id=item_in.trip_stop_id,
        title=item_in.title.strip(),
        description=item_in.description,
        date=item_in.date,
        start_time=item_in.start_time,
        end_time=item_in.end_time,
        item_type=item_in.item_type,
        item_order=item_in.item_order,
        estimated_cost=item_in.estimated_cost,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.put(
    "/api/itinerary/{item_id}",
    response_model=ItineraryItemResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an itinerary item",
    description="Updates title, time, date, type, cost, or linked activity. Verifies trip ownership.",
)
def update_itinerary_item(
    item_id: int,
    item_update: ItineraryItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.get(ItineraryItem, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary item with ID {item_id} not found.",
        )
    # Check parent trip ownership
    get_user_trip_or_403(item.trip_id, current_user.id, db)

    update_data = item_update.model_dump(exclude_unset=True)

    if "activity_id" in update_data and update_data["activity_id"] is not None:
        act = db.get(Activity, update_data["activity_id"])
        if not act:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Activity with ID {update_data['activity_id']} not found.",
            )

    if "trip_stop_id" in update_data and update_data["trip_stop_id"] is not None:
        stop = db.get(TripStop, update_data["trip_stop_id"])
        if not stop or stop.trip_id != item.trip_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Trip stop with ID {update_data['trip_stop_id']} does not belong to this trip.",
            )

    for field, val in update_data.items():
        setattr(item, field, val)

    db.commit()
    db.refresh(item)
    return item


@router.delete(
    "/api/itinerary/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an itinerary item",
    description="Removes a scheduled item from the trip itinerary. Verifies trip ownership.",
)
def delete_itinerary_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.get(ItineraryItem, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary item with ID {item_id} not found.",
        )
    get_user_trip_or_403(item.trip_id, current_user.id, db)

    db.delete(item)
    db.commit()
    return None


@router.post(
    "/api/trips/{trip_id}/itinerary/reorder",
    response_model=List[ItineraryItemResponse],
    status_code=status.HTTP_200_OK,
    summary="Reorder itinerary items",
    description="Accepts an ordered list of itinerary item IDs and updates item_order. Verifies all IDs belong to the trip.",
)
def reorder_itinerary_items(
    trip_id: int,
    reorder_in: ItineraryReorderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)

    # Fetch all items belonging to this trip
    trip_items = (
        db.query(ItineraryItem)
        .filter(ItineraryItem.trip_id == trip.id)
        .all()
    )
    items_by_id = {item.id: item for item in trip_items}

    # Verify that all passed item IDs belong to this trip
    for item_id in reorder_in.item_ids:
        if item_id not in items_by_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Itinerary item with ID {item_id} does not belong to trip {trip_id}.",
            )

    # Update item_order sequentially
    for order_idx, item_id in enumerate(reorder_in.item_ids, start=1):
        item = items_by_id[item_id]
        item.item_order = order_idx

    db.commit()

    # Return updated sorted list
    updated_items = (
        db.query(ItineraryItem)
        .filter(ItineraryItem.trip_id == trip.id)
        .order_by(ItineraryItem.date.asc(), ItineraryItem.item_order.asc())
        .all()
    )
    return updated_items
