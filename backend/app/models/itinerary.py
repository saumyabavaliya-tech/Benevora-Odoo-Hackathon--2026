"""
ItineraryItem ORM Model
"""

from datetime import date, datetime, time
from typing import TYPE_CHECKING, Optional
from decimal import Decimal
from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Time,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.trip import Trip, TripStop
    from app.models.activity import Activity


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    __table_args__ = (
        CheckConstraint("item_order > 0", name="chk_itinerary_item_order_positive"),
        CheckConstraint("estimated_cost >= 0", name="chk_itinerary_cost_non_negative"),
        CheckConstraint(
            "item_type IN ('travel', 'activity', 'meal', 'hotel', 'other')",
            name="chk_itinerary_item_type_valid"
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trip_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    activity_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("activities.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    trip_stop_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("trip_stops.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    end_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    item_type: Mapped[str] = mapped_column(String(20), default="activity", nullable=False)
    item_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    estimated_cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.0"), nullable=False)
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
    trip: Mapped["Trip"] = relationship("Trip", back_populates="itinerary_items")
    activity: Mapped[Optional["Activity"]] = relationship("Activity", back_populates="itinerary_items")
    trip_stop: Mapped[Optional["TripStop"]] = relationship("TripStop", back_populates="itinerary_items")

    def __repr__(self) -> str:
        return f"<ItineraryItem(id={self.id}, trip_id={self.trip_id}, title='{self.title}', type='{self.item_type}')>"
