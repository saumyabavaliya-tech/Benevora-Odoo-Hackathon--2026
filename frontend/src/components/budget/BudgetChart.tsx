import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Expense, ExpenseCategory } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface BudgetChartProps {
  expenses: Expense[];
  totalBudget: number;
  currency?: string;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Transportation: '#2563EB', // Blue
  Accommodation: '#4F46E5', // Indigo
  Food: '#F59E0B', // Amber
  Activities: '#10B981', // Emerald
  Shopping: '#EC4899', // Pink
  Other: '#64748B', // Slate
};

export const BudgetChart: React.FC<BudgetChartProps> = ({
  expenses,
  totalBudget,
  currency = '₹',
}) => {
  // Aggregate by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const pieData = Object.entries(categoryTotals).map(([cat, amount]) => ({
    name: cat,
    value: amount,
    color: CATEGORY_COLORS[cat as ExpenseCategory] || '#94A3B8',
  }));

  const totalSpent = expenses.reduce((a, b) => a + b.amount, 0);

  // Group by date for daily spending
  const dateTotals = expenses.reduce((acc, exp) => {
    acc[exp.date] = (acc[exp.date] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(dateTotals)
    .sort(([d1], [d2]) => d1.localeCompare(d2))
    .map(([date, amount]) => ({
      date: date.slice(5), // MM-DD
      amount,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-800">
          <p className="font-bold">{data.name || data.payload.date}</p>
          <p className="text-blue-300 font-semibold mt-0.5">
            {formatCurrency(data.value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Donut Breakdown */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Expenses by Category</h3>
          <p className="text-xs text-slate-500 mt-0.5">Where your travel funds are going</p>
        </div>

        <div className="h-64 my-4 relative flex items-center justify-center">
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Spent</span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {formatCurrency(totalSpent, currency)}
                </span>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400">No expenses logged yet.</div>
          )}
        </div>

        {/* Category Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Spending Trend */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Daily Spending Flow</h3>
          <p className="text-xs text-slate-500 mt-0.5">Expenses across trip timeline</p>
        </div>

        <div className="h-64 my-4">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No daily transactions yet.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Target Budget: {formatCurrency(totalBudget, currency)}</span>
          <span className={totalSpent > totalBudget ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
            {totalSpent > totalBudget ? 'Over Budget' : 'Within Budget'}
          </span>
        </div>
      </div>
    </div>
  );
};
