"""
Cities Router
Endpoints for browsing and searching destination cities and retrieving city details with curated activities.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.city import City
from app.schemas.city import CityCreate, CityDetailResponse, CityResponse, CityUpdate

router = APIRouter(prefix="/api/cities", tags=["Cities"])


@router.get(
    "",
    response_model=List[CityResponse],
    status_code=status.HTTP_200_OK,
    summary="List all destination cities with optional filters",
    description="Retrieve all discoverable cities, optionally filtered by country, region, search keyword, and cost index range.",
)
def list_cities(
    search: Optional[str] = Query(None, description="Search by name, country, or region"),
    country: Optional[str] = Query(None, description="Filter by country"),
    region: Optional[str] = Query(None, description="Filter by region/state"),
    min_cost: Optional[int] = Query(None, ge=0, description="Minimum cost index"),
    max_cost: Optional[int] = Query(None, ge=0, description="Maximum cost index"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(City)

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                City.name.ilike(term),
                City.country.ilike(term),
                City.region.ilike(term),
                City.description.ilike(term),
            )
        )

    if country:
        query = query.filter(City.country.ilike(f"%{country.strip()}%"))

    if region:
        query = query.filter(City.region.ilike(f"%{region.strip()}%"))

    if min_cost is not None:
        query = query.filter(City.cost_index >= min_cost)

    if max_cost is not None:
        query = query.filter(City.cost_index <= max_cost)

    cities = query.order_by(City.popularity.desc(), City.name.asc()).offset(skip).limit(limit).all()
    return cities


@router.get(
    "/search",
    response_model=List[CityResponse],
    status_code=status.HTTP_200_OK,
    summary="Search destination cities",
    description="Dedicated search endpoint to filter cities by query string, country, region, and cost.",
)
def search_cities(
    search: Optional[str] = Query(None, description="Search query"),
    country: Optional[str] = Query(None, description="Filter by country"),
    region: Optional[str] = Query(None, description="Filter by region"),
    min_cost: Optional[int] = Query(None, ge=0),
    max_cost: Optional[int] = Query(None, ge=0),
    db: Session = Depends(get_db)
):
    return list_cities(
        search=search,
        country=country,
        region=region,
        min_cost=min_cost,
        max_cost=max_cost,
        skip=0,
        limit=50,
        db=db,
    )


@router.get(
    "/{city_id}",
    response_model=CityDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single city details",
    description="Returns detailed information about a destination city, including its curated activities.",
)
def get_city(
    city_id: int,
    db: Session = Depends(get_db)
):
    city = db.get(City, city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with ID {city_id} not found.",
        )
    return city


@router.post(
    "",
    response_model=CityResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new destination city",
    description="Adds a new city to the catalog.",
)
def create_city(
    city_in: CityCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(City)
        .filter(
            City.name.ilike(city_in.name.strip()),
            City.country.ilike(city_in.country.strip()),
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"City '{city_in.name}' in '{city_in.country}' already exists.",
        )
    
    new_city = City(**city_in.model_dump())
    db.add(new_city)
    db.commit()
    db.refresh(new_city)
    return new_city
