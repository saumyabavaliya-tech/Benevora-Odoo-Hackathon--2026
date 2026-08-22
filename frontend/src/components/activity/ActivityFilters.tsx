import React from 'react';
import { cn } from '../../lib/utils';

export const ACTIVITY_CATEGORIES = [
  'All',
  'Sightseeing',
  'Adventure',
  'Food',
  'Culture',
  'Nature',
  'Shopping',
  'Nightlife',
  'Relaxation',
  'Photography',
] as const;

interface ActivityFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none', className)}>
      {ACTIVITY_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              isSelected
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
