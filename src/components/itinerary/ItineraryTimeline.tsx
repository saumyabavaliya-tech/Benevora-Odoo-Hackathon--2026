import React from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  MapPin,
  Plane,
  Building,
  Utensils,
  Camera,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { ItineraryItem } from '../../types';
import { formatCurrency, formatDateString } from '../../lib/utils';

interface ItineraryTimelineProps {
  items: ItineraryItem[];
  currency?: string;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  items,
  currency = '₹',
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        No itinerary items to display on timeline yet.
      </div>
    );
  }

  // Group by dayNumber
  const groupedDays: Record<number, ItineraryItem[]> = {};
  items.forEach((item) => {
    if (!groupedDays[item.dayNumber]) {
      groupedDays[item.dayNumber] = [];
    }
    groupedDays[item.dayNumber].push(item);
  });

  const typeConfig = {
    travel: { icon: Plane, color: 'bg-sky-500 text-white ring-sky-100' },
    accommodation: { icon: Building, color: 'bg-indigo-500 text-white ring-indigo-100' },
    meal: { icon: Utensils, color: 'bg-amber-500 text-white ring-amber-100' },
    activity: { icon: Camera, color: 'bg-emerald-500 text-white ring-emerald-100' },
    leisure: { icon: Coffee, color: 'bg-purple-500 text-white ring-purple-100' },
  };

  return (
    <div className="relative pl-6 sm:pl-8 space-y-8">
      {/* Continuous Timeline Line */}
      <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-slate-200" />

      {Object.entries(groupedDays).map(([dayNum, dayItems]) => (
        <div key={dayNum} className="space-y-4 relative">
          {/* Day Milestone Badge */}
          <div className="flex items-center gap-3 relative -left-6 sm:-left-8">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-lg shadow-blue-600/40 ring-4 ring-slate-900 z-10 border border-blue-400/30">
              D{dayNum}
            </div>
            <div className="bg-slate-900/80 backdrop-blur-xl px-3 py-1 rounded-full border border-white/15 shadow-md text-xs font-bold text-slate-100">
              Day {dayNum} • {formatDateString(dayItems[0]?.date || '2026-09-10', 'EEEE, MMM d')}
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-3 pl-2 sm:pl-3">
            {dayItems.map((item, idx) => {
              const currentType = typeConfig[item.type] || typeConfig.activity;
              const Icon = currentType.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className="relative flex items-start gap-3.5 p-4 bg-slate-900/75 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-lg hover:border-white/30 transition-all group"
                >
                  {/* Icon Node */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ring-4 ring-slate-900/80 ${currentType.color} shadow-xs`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-blue-400 block">
                          {item.time}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{item.title}</h4>
                      </div>
                      <span className="text-xs font-extrabold text-white shrink-0">
                        {formatCurrency(item.estimatedCost, item.currency || currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-300 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.locationName} ({item.cityName})</span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-200 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/10 italic">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
