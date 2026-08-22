"""
Expenses & Budget Router
Endpoints for recording expenditures and calculating dynamic budget breakdowns.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.expense import Expense
from app.models.user import User
from app.routers.trips import get_user_trip_or_403
from app.schemas.expense import (
    BudgetSummaryResponse,
    ExpenseCreate,
    ExpenseResponse,
    ExpenseUpdate,
)
from app.services.budget import calculate_budget_summary

router = APIRouter(tags=["Expenses & Budget"])


@router.get(
    "/api/trips/{trip_id}/expenses",
    response_model=List[ExpenseResponse],
    status_code=status.HTTP_200_OK,
    summary="List expenses for a trip",
    description="Returns all logged expenses for a trip ordered by expense date. Verifies ownership.",
)
def list_trip_expenses(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)
    expenses = (
        db.query(Expense)
        .filter(Expense.trip_id == trip.id)
        .order_by(Expense.expense_date.desc(), Expense.created_at.desc())
        .all()
    )
    return expenses


@router.post(
    "/api/trips/{trip_id}/expenses",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log a new expense for a trip",
    description="Records a new categorized expense against a trip budget. Verifies ownership.",
)
def create_trip_expense(
    trip_id: int,
    expense_in: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)

    new_expense = Expense(
        trip_id=trip.id,
        category=expense_in.category.lower().strip(),
        description=expense_in.description.strip(),
        amount=expense_in.amount,
        currency=expense_in.currency or trip.currency or "INR",
        expense_date=expense_in.expense_date,
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


@router.put(
    "/api/expenses/{expense_id}",
    response_model=ExpenseResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an expense",
    description="Updates expense amount, category, description, or date. Verifies trip ownership.",
)
def update_expense(
    expense_id: int,
    expense_update: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    expense = db.get(Expense, expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID {expense_id} not found.",
        )
    get_user_trip_or_403(expense.trip_id, current_user.id, db)

    update_data = expense_update.model_dump(exclude_unset=True)
    if "category" in update_data and update_data["category"]:
        update_data["category"] = update_data["category"].lower().strip()

    for field, val in update_data.items():
        setattr(expense, field, val)

    db.commit()
    db.refresh(expense)
    return expense


@router.delete(
    "/api/expenses/{expense_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an expense",
    description="Deletes an expense record. Verifies trip ownership.",
)
def delete_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    expense = db.get(Expense, expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID {expense_id} not found.",
        )
    get_user_trip_or_403(expense.trip_id, current_user.id, db)

    db.delete(expense)
    db.commit()
    return None


@router.get(
    "/api/trips/{trip_id}/budget-summary",
    response_model=BudgetSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get budget and expense calculations for a trip",
    description="Calculates total budget, total spent, remaining funds, percentage spent, and categorized breakdown directly from database records.",
)
def get_trip_budget_summary(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = get_user_trip_or_403(trip_id, current_user.id, db)
    return calculate_budget_summary(trip, db)
