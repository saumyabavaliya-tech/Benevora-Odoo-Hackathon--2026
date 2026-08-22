"""
GlobeTrotter FastAPI Main Application
Configures CORS, registers API routers, and exposes health check endpoints.
"""

import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers import (
    activities_router,
    auth_router,
    cities_router,
    expenses_router,
    itinerary_router,
    memories_router,
    shared_router,
    trips_router,
    users_router,
)

load_dotenv()

# Determine allowed origins
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
allowed_origins = [
    frontend_origin,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
# Remove duplicates while preserving order
allowed_origins = list(dict.fromkeys(allowed_origins))

# Create FastAPI application
app = FastAPI(
    title="GlobeTrotter API",
    description="FastAPI Backend for GlobeTrotter — Smart Multi-City Travel Planner, Itinerary Builder, and Budget Tracker.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(cities_router)
app.include_router(activities_router)
app.include_router(trips_router)
app.include_router(itinerary_router)
app.include_router(expenses_router)
app.include_router(memories_router)
app.include_router(shared_router)


# =====================================================================
# ROOT & HEALTH CHECK ENDPOINTS
# =====================================================================

@app.get(
    "/",
    tags=["Root"],
    summary="Root greeting and API discovery",
)
def root():
    return {
        "message": "Welcome to GlobeTrotter API",
        "documentation": "/docs",
        "redoc": "/redoc",
        "health": "/api/health",
        "db_health": "/api/health/db",
    }


@app.get(
    "/api/health",
    tags=["Health"],
    summary="Application Health Check",
    description="Returns standard server status ok.",
)
def health_check():
    return {"status": "ok"}


@app.get(
    "/api/health/db",
    tags=["Health"],
    summary="Database Connection Health Check",
    description="Tests communication with PostgreSQL database.",
)
def db_health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "database": "connected",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(e)}",
        )
