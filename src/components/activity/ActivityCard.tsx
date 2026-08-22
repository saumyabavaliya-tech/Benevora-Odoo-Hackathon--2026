import React from 'react';
import { motion } from 'motion/react';
import { Clock, Star, MapPin, Plus, Wallet, Tag } from 'lucide-react';
import { Activity } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

interface ActivityCardProps {
  activity: Activity;
  onAddToItinerary?: (activity: Activity) => void;
  onViewDetails?: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onAddToItinerary,
  onViewDetails,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 overflow-hidden flex flex-col transition-all"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <SafeImage
          src={activity.imageUrl}
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallbackSrc={DEFAULT_FALLBACK_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant="secondary" size="sm" className="bg-white/90 text-slate-900 border-none backdrop-blur-xs font-semibold">
            {activity.category}
          </Badge>
          <div className="flex items-center gap-1 bg-slate-900/70 text-amber-300 text-xs px-2.5 py-1 rounded-full backdrop-blur-xs font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{activity.rating}</span>
            <span className="text-[10px] text-slate-400">({activity.reviewCount})</span>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-[11px] text-blue-200 font-medium truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{activity.locationName}, {activity.cityName}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {activity.name}
          </h4>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {activity.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{activity.durationHours} hrs</span>
          </div>
          <div className="font-extrabold text-slate-900 text-sm">
            {formatCurrency(activity.estimatedCost, activity.currency)}
          </div>
        </div>

        {activity.tags && (
          <div className="flex flex-wrap gap-1">
            {activity.tags.map((tag) => (
              <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          {onAddToItinerary && (
            <Button
              onClick={() => onAddToItinerary(activity)}
              variant="primary"
              size="sm"
              className="flex-1"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add to Itinerary
            </Button>
          )}
          {onViewDetails && (
            <Button
              onClick={() => onViewDetails(activity)}
              variant="outline"
              size="sm"
            >
              Details
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ActivityItem: React.FC<{ activity: Activity; onAdd?: () => void }> = ({
  activity,
  onAdd,
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all">
      <SafeImage
        src={activity.imageUrl}
        alt={activity.name}
        className="w-12 h-12 rounded-lg object-cover shrink-0"
        fallbackSrc={DEFAULT_FALLBACK_IMAGE}
      />
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-bold text-slate-900 truncate">{activity.name}</h5>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
          <span>{activity.durationHours}h</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">
            {formatCurrency(activity.estimatedCost, activity.currency)}
          </span>
        </div>
      </div>
      {onAdd && (
        <Button onClick={onAdd} variant="secondary" size="sm" className="px-2 py-1 text-xs">
          <Plus className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
};
