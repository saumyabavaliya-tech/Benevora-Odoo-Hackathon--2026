import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, Plus, Eye, Sparkles, TrendingUp } from 'lucide-react';
import { City } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

interface CityCardProps {
  city: City;
  onAddToTrip?: (city: City) => void;
  onViewDetails?: (city: City) => void;
}

export const CityCard: React.FC<CityCardProps> = ({
  city,
  onAddToTrip,
  onViewDetails,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-3xl border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:shadow-slate-200/50 overflow-hidden flex flex-col transition-all"
    >
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <SafeImage
          src={city.imageUrl}
          alt={city.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallbackSrc={DEFAULT_FALLBACK_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <Badge variant="primary" size="sm" className="bg-white/95 text-[#0F172A] font-bold border-none backdrop-blur-xs text-[10px] uppercase tracking-wider shadow-xs">
            {city.costIndex}
          </Badge>
          <div className="flex items-center gap-1 bg-slate-900/80 text-amber-300 text-xs px-2.5 py-1 rounded-full backdrop-blur-xs font-bold border border-slate-700/60">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span>{city.popularityScore}/100</span>
          </div>
        </div>

        {/* City Title */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <div className="flex items-center gap-1 text-xs text-blue-200 font-semibold mb-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2563EB]" />
            <span>{city.country} • {city.region}</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight text-white">{city.name}</h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed font-medium">
          {city.description}
        </p>

        {/* Highlights */}
        <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Top Highlights</span>
          <div className="flex flex-wrap gap-1">
            {city.highlights.slice(0, 2).map((h, i) => (
              <span key={i} className="text-[10px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-2 py-0.5 rounded-md font-semibold">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Best Season */}
        <div className="flex items-center justify-between text-xs pt-2 text-[#64748B]">
          <span className="font-medium">Avg. <strong className="text-[#0F172A]">{formatCurrency(city.averageDailyCost, city.currency)}</strong> / day</span>
          <span className="text-slate-400 font-medium">Best: {city.bestTimeToVisit}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {onAddToTrip && (
            <Button
              onClick={() => onAddToTrip(city)}
              variant="primary"
              size="sm"
              className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add to Trip
            </Button>
          )}
          {onViewDetails && (
            <Button
              onClick={() => onViewDetails(city)}
              variant="outline"
              size="sm"
              className="rounded-xl border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 font-bold"
              leftIcon={<Eye className="w-4 h-4 text-[#64748B]" />}
            >
              Details
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const DestinationCard = CityCard;
