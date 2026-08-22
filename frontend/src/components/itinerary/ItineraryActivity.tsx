import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  CheckCircle,
  Circle,
  Plane,
  Building,
  Utensils,
  Camera,
  Coffee,
} from 'lucide-react';
import { ItineraryItem } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface ItineraryActivityProps {
  item: ItineraryItem;
  onDelete?: (id: string) => void;
  onEdit?: (item: ItineraryItem) => void;
  onToggleComplete?: (id: string) => void;
  isDragDisabled?: boolean;
}

export const ItineraryActivity: React.FC<ItineraryActivityProps> = ({
  item,
  onDelete,
  onEdit,
  onToggleComplete,
  isDragDisabled = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeConfig = {
    travel: { icon: Plane, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    accommodation: { icon: Building, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    meal: { icon: Utensils, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    activity: { icon: Camera, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    leisure: { icon: Coffee, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  };

  const currentType = typeConfig[item.type] || typeConfig.activity;
  const TypeIcon = currentType.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-3 p-4 bg-white rounded-2xl border transition-all ${
        isDragging
          ? 'opacity-50 scale-95 shadow-xl border-blue-500 ring-2 ring-blue-500/20 z-30'
          : item.completed
          ? 'bg-slate-50/70 border-slate-200/60 opacity-70'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Drag handle */}
      {!isDragDisabled && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 p-1 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing rounded transition-colors touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}

      {/* Complete toggle checkbox */}
      {onToggleComplete && (
        <button
          type="button"
          onClick={() => onToggleComplete(item.id)}
          className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors"
        >
          {item.completed ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
          ) : (
            <Circle className="w-4 h-4 text-slate-300" />
          )}
        </button>
      )}

      {/* Type badge icon */}
      <div className={`p-2.5 rounded-xl border shrink-0 ${currentType.color}`}>
        <TypeIcon className="w-4 h-4" />
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h4
            className={`text-sm font-bold truncate ${
              item.completed ? 'line-through text-slate-500' : 'text-slate-900'
            }`}
          >
            {item.title}
          </h4>
          <span className="text-xs font-bold text-slate-900 shrink-0">
            {formatCurrency(item.estimatedCost, item.currency)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-semibold text-blue-600">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.time}</span>
          </div>

          <div className="flex items-center gap-1 truncate text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.locationName} ({item.cityName})</span>
          </div>
        </div>

        {item.notes && (
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100 italic">
            "{item.notes}"
          </p>
        )}
      </div>

      {/* Item Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit activity"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete activity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
