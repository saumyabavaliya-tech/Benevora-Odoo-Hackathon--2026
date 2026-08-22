import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Wallet, PieChart, ArrowDown, ArrowUp, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { BudgetSummary, ExpenseRow, AddExpenseModal } from '../components/budget/BudgetSummary';
import { BudgetChart } from '../components/budget/BudgetChart';
import { Button } from '../components/common/Button';
import { Expense } from '../types';

export const Budget: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, getTrip, updateTrip } = useTrips();
  const trip = tripId ? getTrip(tripId) : trips[0];

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  if (!trip) {
    return (
      <DashboardLayout>
        <PageContainer className="text-center py-20">
          <h2 className="text-lg font-bold text-slate-800">No active trip found</h2>
          <Link to="/trips" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Back to My Trips</Button>
          </Link>
        </PageContainer>
      </DashboardLayout>
    );
  }

  const handleAddExpense = (newExp: Omit<Expense, 'id' | 'tripId' | 'currency'>) => {
    const expenseWithId: Expense = {
      ...newExp,
      id: `exp-${Date.now()}`,
      tripId: trip.id,
      currency: trip.currency,
    };
    updateTrip(trip.id, { expenses: [expenseWithId, ...trip.expenses] });
  };

  const handleDeleteExpense = (expId: string) => {
    const updated = trip.expenses.filter((e) => e.id !== expId);
    updateTrip(trip.id, { expenses: updated });
  };

  const filteredExpenses = filterCategory === 'All'
    ? trip.expenses
    : trip.expenses.filter((e) => e.category === filterCategory);

  return (
    <DashboardLayout tripId={trip.id}>
      <PageContainer className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Link to={`/trips/${trip.id}`} className="hover:underline">
                {trip.name}
              </Link>
              <span>/</span>
              <span>Budget & Expenses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Budget Analytics & Expenses
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live tracking and category breakdowns for your {trip.totalDays}-day journey.
            </p>
          </div>

          <Button
            onClick={() => setIsAddExpenseOpen(true)}
            variant="primary"
            size="md"
            className="bg-blue-600 hover:bg-blue-500 font-bold shadow-md shadow-blue-600/20"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Expense
          </Button>
        </div>

        {/* 3 Metric Cards + Warning Banner */}
        <BudgetSummary
          totalBudget={trip.totalBudget}
          expenses={trip.expenses}
          currency={trip.currency}
          onAddExpense={() => setIsAddExpenseOpen(true)}
        />

        {/* Recharts Donut & Bar Charts */}
        <BudgetChart
          expenses={trip.expenses}
          totalBudget={trip.totalBudget}
          currency={trip.currency}
        />

        {/* Transactions / Expense List */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Expense Log</h3>
              <p className="text-xs text-slate-500">{trip.expenses.length} Total recorded items</p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['All', 'Transportation', 'Accommodation', 'Food', 'Activities', 'Shopping'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filterCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No transactions recorded for this category.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.map((exp) => (
                <ExpenseRow
                  key={exp.id}
                  expense={exp}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Expense Modal */}
        <AddExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          onAdd={handleAddExpense}
          defaultDate={trip.startDate}
          defaultCity={trip.destinations[0]}
        />
      </PageContainer>
    </DashboardLayout>
  );
};
