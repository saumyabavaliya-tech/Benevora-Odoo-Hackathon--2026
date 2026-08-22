"""
Activities Router
Endpoints for browsing and searching curated travel experiences and points of interest.
"""

from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.activity import Activity
from app.models.city import City
from app.schemas.activity import ActivityCreate, ActivityResponse, ActivityUpdate

router = APIRouter(prefix="/api/activities", tags=["Activities"])


@router.get(
    "",
    response_model=List[ActivityResponse],
    status_code=status.HTTP_200_OK,
    summary="List activities with optional filters",
    description="Retrieve curated activities with optional filtering by city ID, category, keyword, and cost range.",
)
def list_activities(
    city_id: Optional[int] = Query(None, description="Filter activities by city ID"),
    category: Optional[str] = Query(None, description="Filter by category (e.g., adventure, sightseeing, food)"),
    search: Optional[str] = Query(None, description="Search by activity name or description"),
    min_cost: Optional[Decimal] = Query(None, ge=0, description="Minimum estimated cost"),
    max_cost: Optional[Decimal] = Query(None, ge=0, description="Maximum estimated cost"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Activity)

    if city_id is not None:
        query = query.filter(Activity.city_id == city_id)

    if category:
        query = query.filter(Activity.category.ilike(category.strip()))

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Activity.name.ilike(term),
                Activity.description.ilike(term),
                Activity.category.ilike(term),
            )
        )

    if min_cost is not None:
        query = query.filter(Activity.estimated_cost >= min_cost)

    if max_cost is not None:
        query = query.filter(Activity.estimated_cost <= max_cost)

    activities = (
        query.order_by(Activity.rating.desc(), Activity.name.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return activities


@router.get(
    "/search",
    response_model=List[ActivityResponse],
    status_code=status.HTTP_200_OK,
    summary="Search activities",
    description="Search endpoint for finding activities by keyword, city, or category.",
)
def search_activities(
    search: Optional[str] = Query(None, description="Search query keyword"),
    city_id: Optional[int] = Query(None, description="City ID filter"),
    category: Optional[str] = Query(None, description="Category filter"),
    min_cost: Optional[Decimal] = Query(None, ge=0),
    max_cost: Optional[Decimal] = Query(None, ge=0),
    db: Session = Depends(get_db)
):
    return list_activities(
        city_id=city_id,
        category=category,
        search=search,
        min_cost=min_cost,
        max_cost=max_cost,
        skip=0,
        limit=50,
        db=db,
    )


@router.get(
    "/{activity_id}",
    response_model=ActivityResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single activity details",
    description="Retrieves a specific activity by its ID.",
)
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    activity = db.get(Activity, activity_id)
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Activity with ID {activity_id} not found.",
        )
    return activity


@router.post(
    "",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new curated activity",
    description="Adds a new activity linked to an existing city.",
)
def create_activity(
    activity_in: ActivityCreate,
    db: Session = Depends(get_db)
):
    # Verify city exists
    city = db.get(City, activity_in.city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with ID {activity_in.city_id} not found.",
        )

    new_activity = Activity(**activity_in.model_dump())
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity
