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
    <div className="bg-slate-900/70 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-xl backdrop-blur-md">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Trip Readiness & Planning</h4>
            <p className="text-xs text-slate-300">
              {trip.destinations.length} Stops • {trip.itinerary.length} scheduled items
            </p>
          </div>
        </div>
        <span className="text-sm font-black text-blue-400">{progressPercent}% Planned</span>
      </div>

      <div className="w-full bg-slate-950/80 border border-white/10 h-2.5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(15, progressPercent)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full relative shadow-md shadow-blue-500/50"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
        <span>Stops: {trip.destinations.join(' ➔ ')}</span>
        <span className="font-semibold text-slate-200">{trip.totalDays} Total Days</span>
      </div>
    </div>
  );
};
