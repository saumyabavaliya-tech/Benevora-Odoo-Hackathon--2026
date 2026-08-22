import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, User, Trash2, Send, Compass } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { ChatMessage } from '../components/saarthi/ChatMessage';
import { ChatInput } from '../components/saarthi/ChatInput';
import { TypingIndicator, MoodSelector, QuickActions } from '../components/saarthi/MoodSelector';
import { ChatMessage as ChatMessageType, MoodType } from '../types';
import { saarthiService } from '../services/mock/saarthi';
import { Button } from '../components/common/Button';

export const TravelSaarthi: React.FC = () => {
  const { trips } = useTrips();
  const activeTrip = trips[0];

  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'msg-init-1',
      sender: 'saarthi',
      content: `Namaste! I am **Travel Saarthi**, your personalized AI travel strategist. 🌟\n\nI can help you build custom multi-city itineraries, suggest authentic food spots, optimize tight budgets, or discover secret hidden gems along your route.\n\nHow would you like to design your next journey?`,
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
    const userMsg: ChatMessageType = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const botResponse = await saarthiService.sendMessage(
        userInput,
        selectedMood ? { mood: selectedMood } : undefined
      );

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error(error);
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

  return (
    <DashboardLayout>
      <PageContainer className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Travel Saarthi AI Co-Pilot
                </h1>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
                  v2.4 Smart AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Your intelligent route synthesizer, budget advisor, and local explorer.
              </p>
            </div>
          </div>

          <Button
            onClick={handleClearChat}
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            className="text-slate-400 hover:text-slate-700"
          >
            Clear Conversation
          </Button>
        </div>

        {/* Chat Body & Side Context Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Stream (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-50/80 rounded-3xl border border-slate-200/80 p-4 sm:p-6 flex flex-col h-[650px] shadow-xs">
            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onActionClick={(act) => handleSendMessage(act)}
                />
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-4 border-t border-slate-200/70 mt-2">
              <ChatInput onSend={handleSendMessage} isLoading={isTyping} />
            </div>
          </div>

          {/* Right Sidebar: Mood Selector & Quick Actions (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active Trip Context Widget */}
            {activeTrip && (
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  Active Journey Context
                </span>
                <h4 className="text-sm font-bold text-slate-900">{activeTrip.name}</h4>
                <p className="text-xs text-slate-500">
                  {activeTrip.destinations.join(' ➔ ')} • {activeTrip.totalDays} Days
                </p>
              </div>
            )}

            {/* Mood Selector Widget */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={(mood) => {
                  setSelectedMood(mood);
                  handleSendMessage(`Adjust recommendations to a ${mood} travel mood.`);
                }}
              />
            </div>

            {/* Quick Actions List */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <QuickActions onActionClick={(prompt) => handleSendMessage(prompt)} />
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};
