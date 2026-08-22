"""
Activity ORM Model
"""

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from decimal import Decimal
from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.city import City
    from app.models.itinerary import ItineraryItem


class Activity(Base):
    __tablename__ = "activities"

    __table_args__ = (
        CheckConstraint("duration_minutes > 0", name="chk_activity_duration_positive"),
        CheckConstraint("estimated_cost >= 0", name="chk_activity_cost_non_negative"),
        CheckConstraint("rating >= 0.0 AND rating <= 5.0", name="chk_activity_rating_range"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    city_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("cities.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    estimated_cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.0"), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    latitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(9, 6), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    city: Mapped["City"] = relationship("City", back_populates="activities")
    itinerary_items: Mapped[List["ItineraryItem"]] = relationship(
        "ItineraryItem",
        back_populates="activity"
    )

    def __repr__(self) -> str:
        return f"<Activity(id={self.id}, name='{self.name}', city_id={self.city_id}, category='{self.category}')>"
