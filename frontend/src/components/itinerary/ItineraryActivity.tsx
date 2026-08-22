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
    travel: { icon: Plane, color: 'text-sky-300 bg-sky-500/20 border-sky-400/30' },
    accommodation: { icon: Building, color: 'text-indigo-300 bg-indigo-500/20 border-indigo-400/30' },
    meal: { icon: Utensils, color: 'text-amber-300 bg-amber-500/20 border-amber-400/30' },
    activity: { icon: Camera, color: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30' },
    leisure: { icon: Coffee, color: 'text-purple-300 bg-purple-500/20 border-purple-400/30' },
  };

  const currentType = typeConfig[item.type] || typeConfig.activity;
  const TypeIcon = currentType.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-3 p-4 rounded-2xl border transition-all ${
        isDragging
          ? 'opacity-50 scale-95 shadow-2xl border-blue-400 bg-slate-900/90 ring-2 ring-blue-500/40 z-30'
          : item.completed
          ? 'bg-slate-900/50 border-white/10 opacity-70 backdrop-blur-md'
          : 'bg-slate-900/80 backdrop-blur-xl border-white/15 hover:border-white/30 hover:shadow-lg'
      }`}
    >
      {/* Drag handle */}
      {!isDragDisabled && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 p-1 text-slate-400 hover:text-white cursor-grab active:cursor-grabbing rounded transition-colors touch-none"
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
          className="mt-1 text-slate-400 hover:text-emerald-400 transition-colors"
        >
          {item.completed ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
          ) : (
            <Circle className="w-4 h-4 text-slate-400" />
          )}
        </button>
      )}

      {/* Type badge icon */}
      <div className={`p-2.5 rounded-xl border shrink-0 backdrop-blur-md ${currentType.color}`}>
        <TypeIcon className="w-4 h-4" />
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h4
            className={`text-sm font-bold truncate ${
              item.completed ? 'line-through text-slate-400' : 'text-white'
            }`}
          >
            {item.title}
          </h4>
          <span className="text-xs font-bold text-white shrink-0">
            {formatCurrency(item.estimatedCost, item.currency)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-300">
          <div className="flex items-center gap-1 font-semibold text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.time}</span>
          </div>

          <div className="flex items-center gap-1 truncate text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.locationName} ({item.cityName})</span>
          </div>
        </div>

        {item.notes && (
          <p className="text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-xl mt-2 border border-white/10 italic">
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
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Edit activity"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Delete activity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
