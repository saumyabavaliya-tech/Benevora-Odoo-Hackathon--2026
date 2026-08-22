"""
User ORM Model
"""

from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.trip import Trip
    from app.models.memory import Memory


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    # When a user is deleted, all their trips and memories are cascaded
    trips: Mapped[List["Trip"]] = relationship(
        "Trip",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="Trip.created_at.desc()"
    )
    memories: Mapped[List["Memory"]] = relationship(
        "Memory",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="Memory.created_at.desc()"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, name='{self.name}', email='{self.email}')>"
