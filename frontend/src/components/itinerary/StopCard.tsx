import React from 'react';
import { MapPin, Calendar, Clock, ArrowDown } from 'lucide-react';
import { TripStop } from '../../types';
import { formatDateRange } from '../../lib/utils';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

interface StopCardProps {
  stop: TripStop;
  isLast?: boolean;
}

export const StopCard: React.FC<StopCardProps> = ({ stop, isLast }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center gap-4 p-4 bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-xl">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-blue-600/30 border border-blue-400/30">
          {stop.order}
        </div>
        {stop.coverImage && (
          <SafeImage
            src={stop.coverImage}
            alt={stop.cityName}
            className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-white/10"
            fallbackSrc={DEFAULT_FALLBACK_IMAGE}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white truncate">{stop.cityName}</h4>
            <span className="text-[11px] text-slate-300 font-medium">({stop.country})</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatDateRange(stop.arrivalDate, stop.departureDate)}</span>
            <span>•</span>
            <span className="font-semibold text-blue-400">{stop.daysCount} Days</span>
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="py-2 flex flex-col items-center text-slate-400">
          <div className="w-0.5 h-4 bg-white/20" />
          <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      )}
    </div>
  );
};
