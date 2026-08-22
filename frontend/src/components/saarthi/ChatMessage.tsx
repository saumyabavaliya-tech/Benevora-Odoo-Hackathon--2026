import React from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
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
    <div className="mt-3 p-4 bg-gradient-to-br from-indigo-950/70 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-indigo-500/30 shadow-lg space-y-3">
      {summary && (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Generated Smart Plan
            </span>
            <span className="text-xs font-extrabold text-white">{summary.estimatedBudget}</span>
          </div>
          <h4 className="text-sm font-black text-white mt-0.5">{summary.title}</h4>
          <p className="text-xs text-indigo-200 font-semibold mt-1">
            Route: {summary.route.join(' ➔ ')} ({summary.duration})
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {summary.highlights.map((h, i) => (
              <span key={i} className="text-[10px] bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-md font-medium">
                ✓ {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {cities && cities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-indigo-500/20">
          {cities.map((city) => (
            <div key={city.id} className="flex items-center gap-2 p-2 bg-slate-900/90 rounded-xl border border-white/15 shadow-md">
              <SafeImage
                src={city.imageUrl}
                alt={city.name}
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10"
                fallbackSrc={DEFAULT_FALLBACK_IMAGE}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{city.name}</p>
                <p className="text-[10px] text-slate-300">{city.bestTimeToVisit}</p>
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
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
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
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30 border border-blue-400/30 mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-xl flex flex-col ${isSaarthi ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isSaarthi
              ? 'bg-slate-900/85 backdrop-blur-2xl rounded-tl-xs border border-white/15 text-slate-100 shadow-xl'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-lg shadow-blue-600/30 border border-blue-400/30'
          }`}
        >
          <div className="text-slate-100 space-y-2">
            <Markdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-base font-extrabold text-white mt-2 mb-1 border-b border-white/10 pb-1">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm font-extrabold text-white mt-3 mb-1 text-sky-300">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold text-sky-200 mt-2.5 mb-1 flex items-center gap-1.5">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xs font-bold text-indigo-300 mt-2 mb-0.5">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="my-1.5 leading-relaxed text-slate-200 text-sm">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-white tracking-wide">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="text-slate-300 italic">
                    {children}
                  </em>
                ),
                ul: ({ children }) => (
                  <ul className="my-2 space-y-1 list-disc list-outside pl-4 text-slate-200 text-sm">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-2 space-y-1 list-decimal list-outside pl-4 text-slate-200 text-sm">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed pl-0.5">
                    {children}
                  </li>
                ),
                hr: () => (
                  <hr className="border-t border-white/15 my-3" />
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-indigo-400 pl-3 italic text-indigo-200 my-2 bg-indigo-950/30 py-1 rounded-r-md">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </Markdown>
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
                className="px-2.5 py-1 bg-slate-900/80 hover:bg-blue-600/30 text-slate-200 hover:text-white border border-white/15 backdrop-blur-md rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                {action} ➔
              </button>
            ))}
          </div>
        )}

        <span className="text-[10px] text-slate-400 mt-1 px-1">{message.timestamp}</span>
      </div>

      {!isSaarthi && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white border border-white/15 flex items-center justify-center shrink-0 mt-1 shadow-md font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};
