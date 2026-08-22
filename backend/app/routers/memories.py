"""
Memories Router
Endpoints for uploading, managing, and browsing travel photos, journal captions, and location memories.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.memory import Memory
from app.models.trip import Trip
from app.models.user import User
from app.schemas.memory import MemoryCreate, MemoryResponse, MemoryUpdate

router = APIRouter(prefix="/api/memories", tags=["Memories"])


def get_user_memory_or_403(memory_id: int, user_id: int, db: Session) -> Memory:
    """
    Retrieve memory by ID and ensure it belongs to the authenticated user.
    """
    memory = db.get(Memory, memory_id)
    if not memory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Memory with ID {memory_id} not found.",
        )
    if memory.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access or modify this memory.",
        )
    return memory


@router.get(
    "",
    response_model=List[MemoryResponse],
    status_code=status.HTTP_200_OK,
    summary="List authenticated user's memories",
    description="Returns all memories uploaded by the authenticated user, optionally filtered by trip ID.",
)
def list_my_memories(
    trip_id: Optional[int] = Query(None, description="Optional trip ID filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Memory).filter(Memory.user_id == current_user.id)
    if trip_id is not None:
        query = query.filter(Memory.trip_id == trip_id)

    memories = query.order_by(Memory.memory_date.desc(), Memory.created_at.desc()).all()
    return memories


@router.get(
    "/{memory_id}",
    response_model=MemoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single memory details",
    description="Returns full memory details. Verifies ownership.",
)
def get_memory(
    memory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_memory_or_403(memory_id, current_user.id, db)


@router.post(
    "",
    response_model=MemoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new memory",
    description="Stores a new travel photo, caption, location, and date linked to the user and optional trip.",
)
def create_memory(
    memory_in: MemoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if memory_in.trip_id:
        trip = db.get(Trip, memory_in.trip_id)
        if not trip or trip.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Trip with ID {memory_in.trip_id} not found or not owned by user.",
            )

    new_memory = Memory(
        user_id=current_user.id,
        trip_id=memory_in.trip_id,
        image_url=memory_in.image_url.strip(),
        caption=memory_in.caption,
        location=memory_in.location,
        memory_date=memory_in.memory_date,
    )
    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)
    return new_memory


@router.put(
    "/{memory_id}",
    response_model=MemoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a memory",
    description="Updates photo URL, caption, location, or memory date. Verifies ownership.",
)
def update_memory(
    memory_id: int,
    memory_update: MemoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memory = get_user_memory_or_403(memory_id, current_user.id, db)

    update_data = memory_update.model_dump(exclude_unset=True)

    if "trip_id" in update_data and update_data["trip_id"] is not None:
        trip = db.get(Trip, update_data["trip_id"])
        if not trip or trip.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Trip with ID {update_data['trip_id']} not found or not owned by user.",
            )

    for field, val in update_data.items():
        setattr(memory, field, val)

    db.commit()
    db.refresh(memory)
    return memory


@router.delete(
    "/{memory_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a memory",
    description="Deletes a memory record. Verifies ownership.",
)
def delete_memory(
    memory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memory = get_user_memory_or_403(memory_id, current_user.id, db)
    db.delete(memory)
    db.commit()
    return None
