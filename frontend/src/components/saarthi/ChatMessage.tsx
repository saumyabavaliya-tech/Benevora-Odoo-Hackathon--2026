import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, User, ArrowRight, MapPin, Check } from 'lucide-react';
import { ChatMessage as ChatMessageType, City, Activity } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../common/Button';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

export const RecommendationCard: React.FC<{
  summary?: {
    title: string;
    route: string[];
    duration: string;
    estimatedBudget: string;
    highlights: string[];
  };
  cities?: City[];
  activities?: Activity[];
  onApply?: () => void;
}> = ({ summary, cities, activities, onApply }) => {
  return (
    <div className="mt-3 p-4 bg-gradient-to-br from-indigo-50/90 to-blue-50/90 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
      {summary && (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Generated Smart Plan
            </span>
            <span className="text-xs font-extrabold text-indigo-950">{summary.estimatedBudget}</span>
          </div>
          <h4 className="text-sm font-black text-indigo-950 mt-0.5">{summary.title}</h4>
          <p className="text-xs text-indigo-800 font-semibold mt-1">
            Route: {summary.route.join(' ➔ ')} ({summary.duration})
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {summary.highlights.map((h, i) => (
              <span key={i} className="text-[10px] bg-white/80 text-indigo-900 px-2 py-0.5 rounded-md font-medium">
                ✓ {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {cities && cities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-indigo-100/80">
          {cities.map((city) => (
            <div key={city.id} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-indigo-100 shadow-2xs">
              <SafeImage
                src={city.imageUrl}
                alt={city.name}
                className="w-9 h-9 rounded-lg object-cover"
                fallbackSrc={DEFAULT_FALLBACK_IMAGE}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{city.name}</p>
                <p className="text-[10px] text-slate-500">{city.bestTimeToVisit}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {onApply && (
        <Button
          onClick={onApply}
          variant="primary"
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold"
          leftIcon={<Check className="w-3.5 h-3.5" />}
        >
          Apply Route to My Itinerary
        </Button>
      )}
    </div>
  );
};

export const ChatMessage: React.FC<{
  message: ChatMessageType;
  onActionClick?: (action: string) => void;
  onApplyPlan?: () => void;
}> = ({ message, onActionClick, onApplyPlan }) => {
  const isSaarthi = message.sender === 'saarthi';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isSaarthi ? 'justify-start' : 'justify-end'}`}
    >
      {isSaarthi && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-xl flex flex-col ${isSaarthi ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isSaarthi
              ? 'bg-white rounded-tl-xs border border-slate-200/80 text-slate-800 shadow-xs'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-blue-500/10'
          }`}
        >
          <div className="whitespace-pre-line prose prose-sm max-w-none">
            {message.content}
          </div>

          {/* Recommendations block if available */}
          {message.recommendations && (
            <RecommendationCard
              summary={message.recommendations.tripPlanSummary}
              cities={message.recommendations.cities}
              activities={message.recommendations.activities}
              onApply={onApplyPlan}
            />
          )}
        </div>

        {/* Suggested Quick Actions */}
        {message.suggestedActions && message.suggestedActions.length > 0 && onActionClick && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.suggestedActions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onActionClick(action)}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 rounded-lg text-xs font-semibold shadow-2xs transition-all"
              >
                {action} ➔
              </button>
            ))}
          </div>
        )}

        <span className="text-[10px] text-slate-400 mt-1 px-1">{message.timestamp}</span>
      </div>

      {!isSaarthi && (
        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};
