"""
Routers Package
Exports all API routers for GlobeTrotter backend.
"""

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.cities import router as cities_router
from app.routers.activities import router as activities_router
from app.routers.trips import router as trips_router
from app.routers.itinerary import router as itinerary_router
from app.routers.expenses import router as expenses_router
from app.routers.memories import router as memories_router
from app.routers.shared import router as shared_router

__all__ = [
    "auth_router",
    "users_router",
    "cities_router",
    "activities_router",
    "trips_router",
    "itinerary_router",
    "expenses_router",
    "memories_router",
    "shared_router",
]
