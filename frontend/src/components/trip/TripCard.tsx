import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight, Wallet, Sparkles, MoreVertical, Copy, Trash2, Share2 } from 'lucide-react';
import { Trip } from '../../types';
import { formatDateRange, formatCurrency } from '../../lib/utils';
import { Badge } from '../common/Badge';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

interface TripCardProps {
  trip: Trip;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onDuplicate,
  onDelete,
  onShare,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const statusVariant = {
    Upcoming: 'primary',
    Ongoing: 'success',
    Completed: 'neutral',
    Draft: 'warning',
  } as const;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-xl hover:shadow-2xl hover:border-white/25 overflow-hidden flex flex-col transition-all duration-300 text-white"
    >
      {/* Cover Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
        <SafeImage
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallbackSrc={DEFAULT_FALLBACK_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <Badge variant={statusVariant[trip.status]} size="sm" className="shadow-md font-bold text-[10px] uppercase tracking-wider backdrop-blur-md">
            {trip.status}
          </Badge>

          {/* Quick Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-800 border border-white/15 backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Trip options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-1 w-40 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-1.5 z-20"
              >
                {onShare && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onShare(trip);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    Share Trip
                  </button>
                )}
                {onDuplicate && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(trip.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    Duplicate
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(trip.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Trip
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Route Chain & Title on Cover */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold mb-1 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>{trip.destinations.join(' → ')}</span>
          </div>
          <h3 className="text-lg font-extrabold tracking-tight text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
            {trip.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
          {trip.description || 'Custom planned adventure with curated activities, transit, and stays.'}
        </p>

        {/* Meta Stats */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 justify-end">
            <Wallet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-white">
              {formatCurrency(trip.totalBudget, trip.currency)}
            </span>
          </div>
        </div>

        {/* Travel Style Tags */}
        {trip.travelStyles && trip.travelStyles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {trip.travelStyles.slice(0, 3).map((style) => (
              <span
                key={style}
                className="text-[10px] font-semibold bg-white/10 border border-white/15 text-slate-200 px-2.5 py-0.5 rounded-full backdrop-blur-md"
              >
                {style}
              </span>
            ))}
          </div>
        )}

        {/* Action Link */}
        <Link
          to={`/trips/${trip.id}`}
          className="w-full mt-1 flex items-center justify-between px-4 py-2.5 bg-white/10 hover:bg-blue-600 text-white border border-white/15 hover:border-blue-500 rounded-2xl text-xs font-bold transition-all group/btn shadow-md backdrop-blur-md"
        >
          <span>View Trip Details</span>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
};
