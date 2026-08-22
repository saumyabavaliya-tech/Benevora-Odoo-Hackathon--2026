import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Trash2,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Flame,
  Route,
  Utensils,
  Wallet,
  Camera,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { ChatMessage } from '../components/saarthi/ChatMessage';
import { ChatInput } from '../components/saarthi/ChatInput';
import { TypingIndicator, MoodSelector, QuickActions } from '../components/saarthi/MoodSelector';
import { ChatMessage as ChatMessageType, MoodType } from '../types';
import { saarthiService } from '../services/mock/saarthi';
import { Button } from '../components/common/Button';

interface PersonaRole {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  promptModifier: string;
}

const PERSONA_ROLES: PersonaRole[] = [
  {
    id: 'strategist',
    name: 'Smart Travel Strategist',
    desc: 'Optimized multi-city pacing & logistics',
    icon: Route,
    promptModifier: 'Act as a seasoned travel planner focusing on optimal timing, scenic routes, and seamless transit.',
  },
  {
    id: 'foodie',
    name: 'Culinary & Street Food Scout',
    desc: 'Local delicacies, night markets & hidden stalls',
    icon: Utensils,
    promptModifier: 'Act as an enthusiastic food critic sharing authentic regional dishes, night markets, and hygiene-verified food stops.',
  },
  {
    id: 'budget',
    name: 'Budget & Value Maximizer',
    desc: 'Smart hacks, affordable stays & discounts',
    icon: Wallet,
    promptModifier: 'Act as a money-saving travel hacker emphasizing budget homestays, public transit, free walking tours, and budget breakdowns.',
  },
  {
    id: 'adventure',
    name: 'Thrill & Adventure Explorer',
    desc: 'Trekking, safaris, water sports & offbeat trails',
    icon: Flame,
    promptModifier: 'Act as an adrenaline-seeking adventure guide recommending treks, water sports, wildlife safaris, and raw nature spots.',
  },
  {
    id: 'culture',
    name: 'Heritage & Storyteller',
    desc: 'Deep history, ancient architecture & folklore',
    icon: Camera,
    promptModifier: 'Act as a cultural historian narrating the architecture, royal folklore, and deep heritage of each destination.',
  },
];

export const TravelSaarthi: React.FC = () => {
  const { trips, updateTrip } = useTrips();
  const activeTrip = trips[0];

  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [selectedPersona, setSelectedPersona] = useState<string>('strategist');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'msg-init-1',
      sender: 'saarthi',
      content: `Namaste! I am **Travel Saarthi**, your personalized multi-turn AI travel strategist powered by **Gemini**. 🌟\n\nI can help you build custom multi-city itineraries, suggest authentic local cuisine, optimize tight budgets, or discover secret photography spots.\n\nHow would you like to design your next journey today?`,
      timestamp: 'Just now',
      suggestedActions: [
        'Plan a 5 day trip from Ahmedabad',
        'Plan a romantic trip under ₹30,000',
        'Make Day 2 less hectic',
        'Reduce my trip budget',
      ],
    },
  ]);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>('Adventurous');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMsg: ChatMessageType = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Build conversation history for multi-turn Gemini API
      const conversationHistory = newMessages.map((m) => ({
        role: (m.sender === 'saarthi' ? 'model' : 'user') as 'user' | 'model',
        content: m.content,
      }));

      // Append persona modifier if applicable
      const currentRole = PERSONA_ROLES.find((r) => r.id === selectedPersona);
      const moodWithPersona = selectedMood
        ? `${selectedMood} (${currentRole?.promptModifier || ''})`
        : currentRole?.promptModifier;

      const botResponse = await saarthiService.sendMessage(userInput, {
        mood: moodWithPersona as any,
        tripContext: activeTrip,
        conversationHistory,
        modelName: selectedModel,
      });

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Failed to get response from Saarthi:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'saarthi',
          content: 'I had a momentary hiccup connecting to the travel servers. Please try again or rephrase your question!',
          timestamp: 'Just now',
          suggestedActions: ['Plan 5-day route', 'Find local street food', 'Optimize budget'],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'saarthi',
        content: `Chat session refreshed. What new destination or itinerary adjustment are you curious about?`,
        timestamp: 'Just now',
        suggestedActions: [
          'Plan a 5 day trip from Ahmedabad',
          'Find hidden gems in Goa',
          'Add authentic food experiences',
        ],
      },
    ]);
  };

  const handleCopyChat = () => {
    const textToCopy = messages
      .map((m) => `[${m.sender.toUpperCase()}]: ${m.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(999);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApplyToTrip = (destinations = ['Ahmedabad', 'Mumbai', 'Goa']) => {
    if (activeTrip) {
      updateTrip(activeTrip.id, {
        destinations: Array.from(new Set([...activeTrip.destinations, ...destinations])),
      });
      setAppliedNotification(`Updated "${activeTrip.name}" with recommended destinations!`);
      setTimeout(() => setAppliedNotification(null), 3500);
    }
  };

  return (
    <DashboardLayout>
      <PageContainer className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-blue-400/30">
              <Sparkles className="w-6 h-6 animate-pulse text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Travel Saarthi AI Co-Pilot
                </h1>
                <span className="text-[10px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Multi-Turn Gemini
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Intelligent itinerary synthesizer, budget advisor, and local explorer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleCopyChat}
              variant="outline"
              size="sm"
              leftIcon={copiedIndex === 999 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              className="text-xs border-white/15 hover:bg-white/10"
            >
              {copiedIndex === 999 ? 'Copied Transcript' : 'Copy Chat'}
            </Button>
            <Button
              onClick={handleClearChat}
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="text-slate-300 hover:text-white hover:bg-white/10 text-xs"
            >
              Reset Chat
            </Button>
          </div>
        </div>

        {/* System Persona Controls */}
        <div className="p-3.5 bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Saarthi AI Persona & Specialty
            </label>
            <span className="text-[10px] text-slate-400 font-medium">
              Powered by Gemini 3.5 Flash
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {PERSONA_ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedPersona === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedPersona(role.id)}
                  title={role.desc}
                  className={`flex flex-col gap-0.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-600/25 border-purple-400/60 text-white shadow-md shadow-purple-600/15'
                      : 'bg-slate-800/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-300' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold truncate">{role.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-1 leading-tight">{role.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Success notification if route was applied */}
        {appliedNotification && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-200 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{appliedNotification}</span>
          </div>
        )}

        {/* Chat Body & Side Context Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Stream (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/15 p-4 sm:p-6 flex flex-col h-[650px] shadow-xl">
            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onActionClick={(act) => handleSendMessage(act)}
                  onApplyPlan={() => handleApplyToTrip(['Ahmedabad', 'Mumbai', 'Goa'])}
                />
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-4 border-t border-white/10 mt-2">
              <ChatInput onSend={handleSendMessage} isLoading={isTyping} />
            </div>
          </div>

          {/* Right Sidebar: Mood Selector & Quick Actions (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active Trip Context Widget */}
            {activeTrip && (
              <div className="p-4 bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                    Active Trip Context
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">₹{activeTrip.totalBudget.toLocaleString()}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{activeTrip.name}</h4>
                <p className="text-xs text-slate-300">
                  {activeTrip.destinations.join(' ➔ ')} • {activeTrip.totalDays} Days
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`Review my current trip "${activeTrip.name}" through [${activeTrip.destinations.join(', ')}] and suggest optimizations.`)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>Ask Saarthi to optimize this trip</span> ➔
                  </button>
                </div>
              </div>
            )}

            {/* Mood Selector Widget */}
            <div className="p-5 bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-xl space-y-3">
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={(mood) => {
                  setSelectedMood(mood);
                  handleSendMessage(`Adjust recommendations to a ${mood} travel mood.`);
                }}
              />
            </div>

            {/* Quick Actions List */}
            <div className="p-5 bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-xl">
              <QuickActions onActionClick={(prompt) => handleSendMessage(prompt)} />
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};
