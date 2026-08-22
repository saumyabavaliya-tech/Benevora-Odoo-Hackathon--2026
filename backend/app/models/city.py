"""
City ORM Model
"""

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from decimal import Decimal
from sqlalchemy import CheckConstraint, DateTime, Float, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.trip import TripStop
    from app.models.activity import Activity


class City(Base):
    __tablename__ = "cities"

    __table_args__ = (
        UniqueConstraint("name", "country", name="uq_city_name_country"),
        CheckConstraint("cost_index >= 0", name="chk_city_cost_index_non_negative"),
        CheckConstraint("popularity >= 0.0 AND popularity <= 5.0", name="chk_city_popularity_range"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    latitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(9, 6), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cost_index: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    popularity: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    best_time_to_visit: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    # A city connects to trip stops. Deleting a city does NOT delete the trip (foreign key uses RESTRICT)
    trip_stops: Mapped[List["TripStop"]] = relationship(
        "TripStop",
        back_populates="city",
        passive_deletes=False
    )
    # Deleting a city cascades to its curated activities
    activities: Mapped[List["Activity"]] = relationship(
        "Activity",
        back_populates="city",
        cascade="all, delete-orphan",
        order_by="Activity.rating.desc()"
    )

    def __repr__(self) -> str:
        return f"<City(id={self.id}, name='{self.name}', country='{self.country}', region='{self.region}')>"
