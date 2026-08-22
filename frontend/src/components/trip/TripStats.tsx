import React from 'react';
import { MapPin, Calendar, CheckCircle2, Wallet } from 'lucide-react';
import { Trip } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface TripStatsProps {
  trip: Trip;
}

export const TripStats: React.FC<TripStatsProps> = ({ trip }) => {
  const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = Math.max(0, trip.totalBudget - totalSpent);
  const activitiesCount = trip.itinerary.filter((i) => i.type === 'activity').length;
  const completedActivities = trip.itinerary.filter((i) => i.completed).length;

  const stats = [
    {
      label: 'Duration',
      value: `${trip.totalDays} Days`,
      sub: `${trip.destinations.length} Cities planned`,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Itinerary Items',
      value: `${trip.itinerary.length} Events`,
      sub: `${activitiesCount} Activities`,
      icon: CheckCircle2,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Total Budget',
      value: formatCurrency(trip.totalBudget, trip.currency),
      sub: `Spent: ${formatCurrency(totalSpent, trip.currency)}`,
      icon: Wallet,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Remaining',
      value: formatCurrency(remainingBudget, trip.currency),
      sub: `${Math.round((remainingBudget / (trip.totalBudget || 1)) * 100)}% budget available`,
      icon: MapPin,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
