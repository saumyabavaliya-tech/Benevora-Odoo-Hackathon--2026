import React from 'react';
import { Plus, Check, MapPin } from 'lucide-react';
import { City } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

interface CitySearchCardProps {
  city: City;
  isSelected?: boolean;
  onSelect: (city: City) => void;
}

export const CitySearchCard: React.FC<CitySearchCardProps> = ({
  city,
  isSelected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(city)}
      className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
          : 'bg-white border-slate-200/80 hover:border-blue-300 hover:bg-slate-50'
      }`}
    >
      <SafeImage
        src={city.imageUrl}
        alt={city.name}
        className="w-14 h-14 rounded-xl object-cover shrink-0"
        fallbackSrc={DEFAULT_FALLBACK_IMAGE}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-bold text-slate-900 truncate">{city.name}</h4>
          <span className="text-[10px] text-slate-400 font-medium">({city.country})</span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{city.description}</p>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
          <span>{formatCurrency(city.averageDailyCost, city.currency)}/day</span>
          <span>•</span>
          <span>{city.climate}</span>
        </div>
      </div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          isSelected
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'
        }`}
      >
        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </div>
    </div>
  );
};

export const CityBadge: React.FC<{ name: string; onRemove?: () => void }> = ({
  name,
  onRemove,
}) => {
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-xl text-xs border border-blue-200/60 shadow-xs">
      <MapPin className="w-3 h-3 text-blue-500" />
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-blue-900 text-blue-400 font-bold"
        >
          ×
        </button>
      )}
    </span>
  );
};
