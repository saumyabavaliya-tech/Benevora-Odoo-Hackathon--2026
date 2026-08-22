"""
Memory ORM Model
"""

from datetime import date, datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.trip import Trip


class Memory(Base):
    __tablename__ = "memories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    trip_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    caption: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    memory_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="memories")
    trip: Mapped[Optional["Trip"]] = relationship("Trip", back_populates="memories")

    def __repr__(self) -> str:
        return f"<Memory(id={self.id}, user_id={self.user_id}, trip_id={self.trip_id}, location='{self.location}')>"
