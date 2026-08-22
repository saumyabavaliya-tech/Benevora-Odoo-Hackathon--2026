import React from 'react';
import { MapPin, Calendar, Clock, ArrowDown, Sparkles } from 'lucide-react';
import { Trip, TripStop } from '../../types';
import { formatDateRange, formatCurrency } from '../../lib/utils';
import { Button } from '../common/Button';

interface MapTripPanelProps {
  trip: Trip;
  selectedCity?: string | null;
  onSelectCity?: (cityName: string) => void;
}

export const MapTripPanel: React.FC<MapTripPanelProps> = ({
  trip,
  selectedCity,
  onSelectCity,
}) => {
  return (
    <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/15 shadow-xl space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Journey Itinerary</span>
        <h3 className="text-xl font-black text-white tracking-tight mt-1">{trip.name}</h3>
        <p className="text-xs text-slate-300 mt-1">
          {trip.destinations.join('  ⟶  ')}
        </p>
      </div>

      {/* Stops Sequential Flow */}
      <div className="space-y-3">
        {trip.stops.map((stop, idx) => {
          const isSelected = selectedCity === stop.cityName;
          const isLast = idx === trip.stops.length - 1;

          return (
            <div key={stop.id} className="relative">
              <div
                onClick={() => onSelectCity?.(stop.cityName)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/25 border-blue-400 shadow-lg ring-2 ring-blue-500/40 backdrop-blur-xl'
                    : 'bg-slate-900/80 backdrop-blur-xl border-white/15 hover:border-white/30 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-blue-400/30">
                      {stop.order}
                    </span>
                    <h4 className="text-sm font-bold text-white">{stop.cityName}</h4>
                  </div>
                  <span className="text-xs font-semibold text-blue-300">
                    {stop.daysCount} Days
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 mt-1.5 pl-8">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{formatDateRange(stop.arrivalDate, stop.departureDate)}</span>
                </div>

                {stop.notes && (
                  <p className="text-[11px] text-slate-200 bg-slate-950/60 p-2.5 rounded-xl mt-2 ml-8 border border-white/10 italic">
                    {stop.notes}
                  </p>
                )}
              </div>

              {!isLast && (
                <div className="py-1.5 flex justify-center text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-indigo-500/20 backdrop-blur-xl rounded-2xl border border-indigo-400/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-white">AI Route Optimization</p>
          <p className="text-indigo-200 mt-0.5">
            This route minimizes travel fatigue with scenic rail & flight connections.
          </p>
        </div>
      </div>
    </div>
  );
};
