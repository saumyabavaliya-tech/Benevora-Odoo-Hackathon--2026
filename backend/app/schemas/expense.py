"""
Expense & Budget Pydantic Schemas
"""

from datetime import date, datetime
from decimal import Decimal
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ExpenseBase(BaseModel):
    category: str = Field(..., description="Category: 'transportation', 'accommodation', 'food', 'activities', 'shopping', 'other'")
    description: str = Field(..., min_length=2, max_length=255)
    amount: Decimal = Field(..., ge=0, description="Expense amount (>= 0)")
    currency: str = Field(default="INR", max_length=3)
    expense_date: date


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    description: Optional[str] = Field(None, min_length=2, max_length=255)
    amount: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
    expense_date: Optional[date] = None


class ExpenseResponse(ExpenseBase):
    id: int
    trip_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CategoryExpenseTotal(BaseModel):
    category: str
    total_amount: Decimal
    percentage: float


class BudgetSummaryResponse(BaseModel):
    trip_id: int
    total_budget: Decimal
    total_expenses: Decimal
    remaining_budget: Decimal
    currency: str
    percentage_spent: float
    category_totals: Dict[str, Decimal]
    categories_breakdown: List[CategoryExpenseTotal]
