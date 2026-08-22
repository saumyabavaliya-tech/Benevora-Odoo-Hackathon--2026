"""
User Profile Router
Endpoints for fetching and updating the authenticated user's profile.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth import hash_password

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="Returns full profile information for the authenticated user.",
)
def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update current user profile",
    description="Allows updating user's name, email, and password. Only updates fields provided.",
)
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if updating email to another existing user's email
    if user_update.email and user_update.email.lower() != current_user.email.lower():
        existing = db.query(User).filter(User.email == user_update.email.lower().strip()).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email address is already in use by another account.",
            )
        current_user.email = user_update.email.lower().strip()

    if user_update.name is not None:
        current_user.name = user_update.name.strip()

    if user_update.password is not None:
        current_user.password_hash = hash_password(user_update.password)

    db.commit()
    db.refresh(current_user)
    return current_user
