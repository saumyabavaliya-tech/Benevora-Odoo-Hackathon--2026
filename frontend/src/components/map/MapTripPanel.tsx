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
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Journey Itinerary</span>
        <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">{trip.name}</h3>
        <p className="text-xs text-slate-500 mt-1">
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
                    ? 'bg-blue-50 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {stop.order}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{stop.cityName}</h4>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">
                    {stop.daysCount} Days
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 pl-8">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDateRange(stop.arrivalDate, stop.departureDate)}</span>
                </div>

                {stop.notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 ml-8 border border-slate-100 italic">
                    {stop.notes}
                  </p>
                )}
              </div>

              {!isLast && (
                <div className="py-1.5 flex justify-center text-slate-300">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-400 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-indigo-950">AI Route Optimization</p>
          <p className="text-indigo-700 mt-0.5">
            This route minimizes travel fatigue with scenic rail & flight connections.
          </p>
        </div>
      </div>
    </div>
  );
};
