import React from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, Calendar, Tag } from 'lucide-react';
import { Memory } from '../../types';
import { formatDateString } from '../../lib/utils';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

interface MemoryCardProps {
  memory: Memory;
  onLike?: (id: string) => void;
  onClick?: (memory: Memory) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onLike,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.(memory)}
      className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-xs hover:shadow-xl cursor-pointer transition-all"
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100">
        <SafeImage
          src={memory.imageUrl}
          alt={memory.caption}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          fallbackSrc={DEFAULT_FALLBACK_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="text-[11px] font-bold text-white bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {memory.tripName || 'Travel Story'}
          </span>

          {onLike && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLike(memory.id);
              }}
              className="flex items-center gap-1 text-xs font-bold text-white bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full hover:bg-rose-600 transition-colors border border-white/10"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{memory.likesCount}</span>
            </button>
          )}
        </div>

        {/* Bottom Details Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{memory.cityName}, {memory.country}</span>
          </div>

          <p className="text-sm font-bold text-white line-clamp-2 leading-snug">
            "{memory.caption}"
          </p>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-300">
            <span>{formatDateString(memory.date, 'MMM d, yyyy')}</span>
            {memory.tags && memory.tags.length > 0 && (
              <span className="text-blue-200 font-medium">#{memory.tags[0]}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
