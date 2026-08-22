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
            <label className="text-sm font-semibold text-slate-200 block mb-1.5">
              Category
            </label>
            <select
              className="w-full rounded-xl border border-white/15 bg-slate-900/80 text-white px-3.5 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              {...register('category')}
            >
              <option value="Transportation" className="bg-slate-900 text-white">Transportation</option>
              <option value="Accommodation" className="bg-slate-900 text-white">Accommodation</option>
              <option value="Food" className="bg-slate-900 text-white">Food & Dining</option>
              <option value="Activities" className="bg-slate-900 text-white">Activities & Tickets</option>
              <option value="Shopping" className="bg-slate-900 text-white">Shopping & Gifts</option>
              <option value="Other" className="bg-slate-900 text-white">Other</option>
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

        <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
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
    <div className="flex items-center justify-between p-3.5 bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/15 hover:border-white/30 transition-all group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{expense.title}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
            <span className="font-semibold text-blue-300">{expense.category}</span>
            <span>•</span>
            <span>{formatDateString(expense.date, 'MMM d')}</span>
            {expense.cityName && (
              <>
                <span>•</span>
                <span className="truncate text-slate-400">{expense.cityName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-black text-white">
          {formatCurrency(expense.amount, expense.currency)}
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(expense.id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
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
        <div className="flex items-center gap-3 p-4 bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-2xl backdrop-blur-md">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          <div className="text-xs">
            <p className="font-bold text-rose-200">Budget Exceeded by {formatCurrency(Math.abs(remaining), currency)}!</p>
            <p className="text-rose-300">Consider asking Travel Saarthi to optimize your route or stay costs.</p>
          </div>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/70 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Budget</span>
          <div className="text-2xl font-black text-white mt-1">
            <AnimatedCounter value={totalBudget} isCurrency currency={currency} />
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Allocated limit</span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Spent</span>
          <div className="text-2xl font-black text-white mt-1">
            <AnimatedCounter value={totalSpent} isCurrency currency={currency} />
          </div>
          <span className="text-xs text-slate-300 mt-1 block">{percentUsed}% of total budget</span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Remaining</span>
          <div
            className={`text-2xl font-black mt-1 ${
              isOverBudget ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            <AnimatedCounter value={Math.max(0, remaining)} isCurrency currency={currency} />
          </div>
          <span className="text-xs text-slate-300 mt-1 block">
            {isOverBudget ? 'Exceeded limit' : 'Safe to spend'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const BudgetCard = BudgetSummary;
