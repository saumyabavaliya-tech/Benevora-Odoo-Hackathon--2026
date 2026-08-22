import React from 'react';
import { motion } from 'motion/react';
import { Plane, Compass } from 'lucide-react';
import { Trip } from '../../types';

interface TripProgressProps {
  trip: Trip;
}

export const TripProgress: React.FC<TripProgressProps> = ({ trip }) => {
  const completedCount = trip.itinerary.filter((i) => i.completed).length;
  const totalCount = trip.itinerary.length || 1;
  const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Trip Readiness & Planning</h4>
            <p className="text-xs text-slate-500">
              {trip.destinations.length} Stops • {trip.itinerary.length} scheduled items
            </p>
          </div>
        </div>
        <span className="text-sm font-extrabold text-blue-600">{progressPercent}% Planned</span>
      </div>

      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(15, progressPercent)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full relative"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>Stops: {trip.destinations.join(' ➔ ')}</span>
        <span className="font-semibold text-slate-700">{trip.totalDays} Total Days</span>
      </div>
    </div>
  );
};
