"""
Budget & Expense Calculation Service
Calculates total expenditures, remaining budgets, and categorized breakdowns from database records.
"""

from decimal import Decimal
from typing import Dict, List
from sqlalchemy.orm import Session
from app.models.trip import Trip
from app.models.expense import Expense
from app.schemas.expense import BudgetSummaryResponse, CategoryExpenseTotal


def calculate_budget_summary(trip: Trip, db: Session) -> BudgetSummaryResponse:
    """
    Compute full budget summary and category breakdown for a trip from database records.
    
    :param trip: Trip model instance
    :param db: Active database session
    :return: BudgetSummaryResponse schema
    """
    expenses: List[Expense] = (
        db.query(Expense)
        .filter(Expense.trip_id == trip.id)
        .all()
    )

    total_budget = Decimal(str(trip.budget or 0))
    category_totals_dict: Dict[str, Decimal] = {
        "transportation": Decimal("0.0"),
        "accommodation": Decimal("0.0"),
        "food": Decimal("0.0"),
        "activities": Decimal("0.0"),
        "shopping": Decimal("0.0"),
        "other": Decimal("0.0"),
    }

    total_expenses = Decimal("0.0")

    for expense in expenses:
        amount = Decimal(str(expense.amount or 0))
        total_expenses += amount
        cat = expense.category.lower() if expense.category else "other"
        category_totals_dict[cat] = category_totals_dict.get(cat, Decimal("0.0")) + amount

    remaining_budget = total_budget - total_expenses
    percentage_spent = (
        round(float(total_expenses / total_budget * 100), 2)
        if total_budget > 0
        else 0.0
    )

    categories_breakdown: List[CategoryExpenseTotal] = []
    for cat, amount in category_totals_dict.items():
        cat_pct = (
            round(float(amount / total_expenses * 100), 2)
            if total_expenses > 0
            else 0.0
        )
        categories_breakdown.append(
            CategoryExpenseTotal(
                category=cat,
                total_amount=amount,
                percentage=cat_pct
            )
        )

    return BudgetSummaryResponse(
        trip_id=trip.id,
        total_budget=total_budget,
        total_expenses=total_expenses,
        remaining_budget=remaining_budget,
        currency=trip.currency or "INR",
        percentage_spent=percentage_spent,
        category_totals=category_totals_dict,
        categories_breakdown=categories_breakdown,
    )
