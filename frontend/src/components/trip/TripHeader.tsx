import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Wallet,
  Share2,
  Edit,
  Sparkles,
  Navigation,
  ListTodo,
  PieChart,
} from 'lucide-react';
import { Trip } from '../../types';
import { formatDateRange, formatCurrency } from '../../lib/utils';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

interface TripHeaderProps {
  trip: Trip;
  onShare?: () => void;
  onEdit?: () => void;
}

export const TripHeader: React.FC<TripHeaderProps> = ({ trip, onShare, onEdit }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800">
      {/* Background Cover */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover opacity-35"
          fallbackSrc={DEFAULT_FALLBACK_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 flex flex-col gap-6">
        {/* Top bar with status and sharing */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="md" className="bg-blue-600/90 text-white border-none shadow-sm">
              {trip.status} Trip
            </Badge>
            <span className="text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              {trip.totalDays} Days Journey
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onShare && (
              <Button
                onClick={onShare}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs"
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share
              </Button>
            )}
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
              >
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Title and destinations */}
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-2">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{trip.destinations.join('  ⟶  ')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl">
            {trip.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {trip.description}
          </p>
        </div>

        {/* Key metadata pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">
              Budget: {formatCurrency(trip.totalBudget, trip.currency)}
            </span>
          </div>
          {trip.travelStyles && trip.travelStyles.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">Styles:</span>
              {trip.travelStyles.map((s) => (
                <span key={s} className="bg-white/15 px-2 py-0.5 rounded text-xs text-white">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sub-navigation action buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-white/10">
          <Link to={`/trips/${trip.id}/itinerary`}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ListTodo className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-500 font-bold"
            >
              Build Itinerary
            </Button>
          </Link>
          <Link to={`/trips/${trip.id}/map`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Navigation className="w-4 h-4" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs"
            >
              View Route Map
            </Button>
          </Link>
          <Link to={`/trips/${trip.id}/budget`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PieChart className="w-4 h-4" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs"
            >
              View Budget & Charts
            </Button>
          </Link>
          <Link to="/travel-saarthi">
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
              className="bg-indigo-600/90 hover:bg-indigo-500 font-bold"
            >
              Ask Travel Saarthi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
