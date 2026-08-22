import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Wallet,
  AlertTriangle,
  Plus,
  Trash2,
  Plane,
  Building,
  Utensils,
  Camera,
  ShoppingBag,
  HelpCircle,
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types';
import { formatCurrency, formatDateString } from '../../lib/utils';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { AnimatedCounter } from '../common/AnimatedCounter';

const expenseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  category: z.enum(['Transportation', 'Accommodation', 'Food', 'Activities', 'Shopping', 'Other']),
  date: z.string().min(1, 'Date is required'),
  cityName: z.string().optional(),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id' | 'tripId' | 'currency'>) => void;
  defaultDate?: string;
  defaultCity?: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultDate = new Date().toISOString().split('T')[0],
  defaultCity = '',
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: defaultDate,
      category: 'Food',
      cityName: defaultCity,
      amount: 500,
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    onAdd(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Trip Expense"
      description="Record a new cost to keep your budget balanced."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Expense Title"
          placeholder="e.g., Train Tickets, Seafood Dinner, Souvenirs"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount (₹)"
            type="number"
            step="10"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Category
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              {...register('category')}
            >
              <option value="Transportation">Transportation</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Food">Food & Dining</option>
              <option value="Activities">Activities & Tickets</option>
              <option value="Shopping">Shopping & Gifts</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
          <Input
            label="City / Location"
            placeholder="e.g. Mumbai, Panaji"
            error={errors.cityName?.message}
            {...register('cityName')}
          />
        </div>

        <Input
          label="Notes (Optional)"
          placeholder="e.g. Split with Het & Alex"
          {...register('notes')}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const ExpenseRow: React.FC<{
  expense: Expense;
  onDelete?: (id: string) => void;
}> = ({ expense, onDelete }) => {
  const categoryIcons: Record<ExpenseCategory, any> = {
    Transportation: Plane,
    Accommodation: Building,
    Food: Utensils,
    Activities: Camera,
    Shopping: ShoppingBag,
    Other: HelpCircle,
  };

  const Icon = categoryIcons[expense.category] || HelpCircle;

  return (
    <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">{expense.title}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span className="font-semibold text-slate-700">{expense.category}</span>
            <span>•</span>
            <span>{formatDateString(expense.date, 'MMM d')}</span>
            {expense.cityName && (
              <>
                <span>•</span>
                <span className="truncate">{expense.cityName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-black text-slate-900">
          {formatCurrency(expense.amount, expense.currency)}
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(expense.id)}
            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            title="Delete expense"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const BudgetSummary: React.FC<{
  totalBudget: number;
  expenses: Expense[];
  currency?: string;
  onAddExpense?: () => void;
}> = ({ totalBudget, expenses, currency = '₹', onAddExpense }) => {
  const totalSpent = expenses.reduce((a, b) => a + b.amount, 0);
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;
  const percentUsed = Math.min(100, Math.round((totalSpent / (totalBudget || 1)) * 100));

  return (
    <div className="space-y-4">
      {/* Exceeded Warning Banner */}
      {isOverBudget && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          <div className="text-xs">
            <p className="font-bold">Budget Exceeded by {formatCurrency(Math.abs(remaining), currency)}!</p>
            <p className="text-rose-600">Consider asking Travel Saarthi to optimize your route or stay costs.</p>
          </div>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Budget</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            <AnimatedCounter value={totalBudget} isCurrency currency={currency} />
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Allocated limit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spent</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            <AnimatedCounter value={totalSpent} isCurrency currency={currency} />
          </div>
          <span className="text-xs text-slate-500 mt-1 block">{percentUsed}% of total budget</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Remaining</span>
          <div
            className={`text-2xl font-black mt-1 ${
              isOverBudget ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            <AnimatedCounter value={Math.max(0, remaining)} isCurrency currency={currency} />
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {isOverBudget ? 'Exceeded limit' : 'Safe to spend'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const BudgetCard = BudgetSummary;
