import React, { useState } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { ItineraryItem } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Modal } from '../common/Modal';

interface ItineraryCalendarProps {
  items: ItineraryItem[];
  startDateStr?: string;
  currency?: string;
}

export const ItineraryCalendar: React.FC<ItineraryCalendarProps> = ({
  items,
  startDateStr = '2026-09-10',
  currency = '₹',
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    try {
      return parseISO(startDateStr);
    } catch {
      return new Date();
    }
  });

  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getItemsForDate = (date: Date) => {
    return items.filter((item) => {
      try {
        const itemDate = parseISO(item.date);
        return isSameDay(itemDate, date);
      } catch {
        return false;
      }
    });
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/15 shadow-xl space-y-6">
      {/* Month header & navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-400/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-slate-300">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Leading empty slots */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-24 bg-slate-950/40 rounded-xl border border-white/5" />
        ))}

        {daysInMonth.map((day) => {
          const dayItems = getItemsForDate(day);
          const hasItems = dayItems.length > 0;

          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 p-2 rounded-2xl border flex flex-col justify-between transition-all ${
                hasItems
                  ? 'bg-blue-900/30 border-blue-400/40 shadow-md backdrop-blur-md'
                  : 'bg-slate-950/50 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${
                    hasItems ? 'bg-blue-600 text-white' : 'text-slate-300'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {hasItems && (
                  <span className="text-[10px] font-bold text-blue-300">
                    {dayItems.length} items
                  </span>
                )}
              </div>

              {/* Event pills in day box */}
              <div className="space-y-1 mt-1.5 overflow-hidden">
                {dayItems.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-1 rounded-lg bg-slate-900/90 border border-white/15 text-[10px] font-semibold text-white truncate cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {item.time} {item.title}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <span className="text-[10px] text-blue-300 font-bold block text-center">
                    +{dayItems.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Detail Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          description={`Scheduled on ${selectedItem.date} at ${selectedItem.time}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{selectedItem.locationName} ({selectedItem.cityName})</span>
              </div>
              <span className="font-bold text-white text-sm">
                {formatCurrency(selectedItem.estimatedCost, selectedItem.currency || currency)}
              </span>
            </div>

            {selectedItem.notes && (
              <div>
                <span className="text-xs font-semibold text-slate-300 uppercase">Notes</span>
                <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl mt-1 border border-white/10">
                  {selectedItem.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
