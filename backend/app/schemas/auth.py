"""
Authentication Pydantic Schemas
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered user email")
    password: str = Field(..., description="User account password")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
