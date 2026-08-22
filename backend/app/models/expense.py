"""
Expense ORM Model
"""

from datetime import date, datetime
from typing import TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.trip import Trip


class Expense(Base):
    __tablename__ = "expenses"

    __table_args__ = (
        CheckConstraint("amount >= 0", name="chk_expense_amount_non_negative"),
        CheckConstraint(
            "category IN ('transportation', 'accommodation', 'food', 'activities', 'shopping', 'other')",
            name="chk_expense_category_valid"
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trip_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    expense_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    trip: Mapped["Trip"] = relationship("Trip", back_populates="expenses")

    def __repr__(self) -> str:
        return f"<Expense(id={self.id}, trip_id={self.trip_id}, category='{self.category}', amount={self.amount})>"
