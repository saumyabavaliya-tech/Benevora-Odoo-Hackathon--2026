import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { MoodType } from '../../types';

export const MOODS: { type: MoodType; label: string; icon: string }[] = [
  { type: 'Adventurous', label: 'Adventurous', icon: '🧗‍♂️' },
  { type: 'Relaxed', label: 'Relaxed', icon: '🌴' },
  { type: 'Romantic', label: 'Romantic', icon: '❤️' },
  { type: 'Foodie', label: 'Foodie', icon: '🍲' },
  { type: 'Photography', label: 'Photography', icon: '📸' },
  { type: 'Backpacking', label: 'Backpacking', icon: '🎒' },
  { type: 'Peaceful', label: 'Peaceful', icon: '🧘‍♀️' },
  { type: 'Family', label: 'Family', icon: '👨‍👩‍👧' },
  { type: 'Party', label: 'Party', icon: '🎉' },
  { type: 'Luxury', label: 'Luxury', icon: '✨' },
];

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl rounded-tl-sm border border-slate-100 shadow-xs max-w-xs">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
        <Sparkles className="w-4 h-4 animate-spin" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 mr-1">Saarthi is thinking</span>
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export const MoodSelector: React.FC<{
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
}> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
        Select Travel Mood
      </label>
      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => {
          const isSelected = selectedMood === m.type;
          return (
            <button
              key={m.type}
              type="button"
              onClick={() => onSelectMood(m.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 hover:border-blue-300'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const QuickActions: React.FC<{
  onActionClick: (prompt: string) => void;
}> = ({ onActionClick }) => {
  const actions = [
    'Plan a 5 day trip from Ahmedabad',
    'Plan a romantic trip under ₹30,000',
    'Make Day 2 less hectic',
    'Reduce my trip budget',
    'Make it more adventurous',
    'Add authentic food experiences',
    'Optimize my itinerary',
    'Find hidden gems in Goa',
  ];

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
        Quick Prompts
      </span>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((act, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onActionClick(act)}
            className="px-3 py-1.5 bg-slate-100/80 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-semibold border border-transparent hover:border-blue-200 transition-all text-left"
          >
            {act}
          </button>
        ))}
      </div>
    </div>
  );
};
