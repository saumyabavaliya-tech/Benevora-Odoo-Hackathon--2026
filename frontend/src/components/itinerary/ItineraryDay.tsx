import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Calendar, Plus, MapPin, Sparkles } from 'lucide-react';
import { ItineraryItem } from '../../types';
import { formatDateString, formatCurrency } from '../../lib/utils';
import { ItineraryActivity } from './ItineraryActivity';
import { Button } from '../common/Button';

interface ItineraryDayProps {
  dayNumber: number;
  dateStr: string;
  cityName: string;
  items: ItineraryItem[];
  currency?: string;
  onAddItem?: (dayNumber: number) => void;
  onDeleteItem?: (id: string) => void;
  onEditItem?: (item: ItineraryItem) => void;
  onToggleComplete?: (id: string) => void;
}

export const ItineraryDay: React.FC<ItineraryDayProps> = ({
  dayNumber,
  dateStr,
  cityName,
  items,
  currency = '₹',
  onAddItem,
  onDeleteItem,
  onEditItem,
  onToggleComplete,
}) => {
  const dayTotal = items.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return (
    <div className="bg-slate-50/60 rounded-3xl p-4 sm:p-6 border border-slate-200/70 space-y-4">
      {/* Day Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center font-bold shadow-sm">
            <span className="text-[10px] uppercase font-semibold leading-none">Day</span>
            <span className="text-sm font-extrabold leading-none">{dayNumber}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                {formatDateString(dateStr, 'EEEE, MMM d')}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                <MapPin className="w-3 h-3" />
                {cityName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {items.length} {items.length === 1 ? 'event' : 'events'} planned
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Day Total</span>
            <span className="text-sm font-black text-slate-900">
              {formatCurrency(dayTotal, currency)}
            </span>
          </div>

          {onAddItem && (
            <Button
              onClick={() => onAddItem(dayNumber)}
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
            >
              Add Activity
            </Button>
          )}
        </div>
      </div>

      {/* Sortable Items Container */}
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5">
          {items.length === 0 ? (
            <div className="text-center py-8 px-4 bg-white/70 rounded-2xl border border-dashed border-slate-300">
              <p className="text-xs text-slate-400 font-medium">No activities added for Day {dayNumber} yet.</p>
              {onAddItem && (
                <button
                  type="button"
                  onClick={() => onAddItem(dayNumber)}
                  className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                >
                  + Add first stop or meal
                </button>
              )}
            </div>
          ) : (
            items.map((item) => (
              <ItineraryActivity
                key={item.id}
                item={item}
                onDelete={onDeleteItem}
                onEdit={onEditItem}
                onToggleComplete={onToggleComplete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};
