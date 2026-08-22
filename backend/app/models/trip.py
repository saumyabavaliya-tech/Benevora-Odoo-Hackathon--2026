"""
Trip and TripStop ORM Models
"""

from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional
from decimal import Decimal
from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.city import City
    from app.models.itinerary import ItineraryItem
    from app.models.expense import Expense
    from app.models.memory import Memory


class Trip(Base):
    __tablename__ = "trips"

    __table_args__ = (
        CheckConstraint("end_date >= start_date", name="chk_trip_dates_valid"),
        CheckConstraint("budget >= 0", name="chk_trip_budget_non_negative"),
        CheckConstraint(
            "status IN ('draft', 'upcoming', 'ongoing', 'completed')",
            name="chk_trip_status_valid"
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    budget: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.0"), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="draft", nullable=False)
    cover_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    share_id: Mapped[Optional[str]] = mapped_column(String(64), unique=True, nullable=True, index=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
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
    user: Mapped["User"] = relationship("User", back_populates="trips")

    # Cascades: If a trip is deleted, its stops, itinerary, expenses and memories are deleted
    trip_stops: Mapped[List["TripStop"]] = relationship(
        "TripStop",
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="TripStop.stop_order"
    )
    itinerary_items: Mapped[List["ItineraryItem"]] = relationship(
        "ItineraryItem",
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="ItineraryItem.item_order"
    )
    expenses: Mapped[List["Expense"]] = relationship(
        "Expense",
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="Expense.expense_date"
    )
    memories: Mapped[List["Memory"]] = relationship(
        "Memory",
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="Memory.created_at.desc()"
    )

    def __repr__(self) -> str:
        return f"<Trip(id={self.id}, name='{self.name}', user_id={self.user_id}, status='{self.status}')>"


class TripStop(Base):
    __tablename__ = "trip_stops"

    __table_args__ = (
        CheckConstraint("departure_date >= arrival_date", name="chk_stop_dates_valid"),
        CheckConstraint("stop_order > 0", name="chk_stop_order_positive"),
        UniqueConstraint("trip_id", "stop_order", name="uq_trip_stop_order"),
        UniqueConstraint("trip_id", "city_id", "stop_order", name="uq_trip_city_stop_order"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trip_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    city_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("cities.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    arrival_date: Mapped[date] = mapped_column(Date, nullable=False)
    departure_date: Mapped[date] = mapped_column(Date, nullable=False)
    stop_order: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    trip: Mapped["Trip"] = relationship("Trip", back_populates="trip_stops")
    city: Mapped["City"] = relationship("City", back_populates="trip_stops")
    itinerary_items: Mapped[List["ItineraryItem"]] = relationship(
        "ItineraryItem",
        back_populates="trip_stop"
    )

    def __repr__(self) -> str:
        return f"<TripStop(id={self.id}, trip_id={self.trip_id}, city_id={self.city_id}, order={self.stop_order})>"
