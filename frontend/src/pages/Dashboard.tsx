import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Compass,
  PlusCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  MapPin,
  Wallet,
  Clock,
  Send,
  Search,
  MoreHorizontal,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { TripCard } from '../components/trip/TripCard';
import { CityCard } from '../components/city/CityCard';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../components/ui/SafeImage';
import { Button } from '../components/common/Button';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { formatCurrency, formatDateRange } from '../lib/utils';
import { mockCities } from '../data/mockData';
import { saarthiService } from '../services/mock/saarthi';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trips, deleteTrip, duplicateTrip } = useTrips();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [saarthiInput, setSaarthiInput] = useState('');
  const [saarthiMessages, setSaarthiMessages] = useState([
    {
      id: '1',
      sender: 'saarthi',
      text: "I see you're planning your upcoming trip! Would you like me to curate authentic sunset spots and local food stops?",
    },
    {
      id: '2',
      sender: 'user',
      text: 'Yes, please find scenic cafes with local seafood or street snacks.',
    },
  ]);
  const [isSaarthiThinking, setIsSaarthiThinking] = useState(false);

  const upcomingTrip = trips.find((t) => t.status === 'Ongoing') || trips.find((t) => t.status === 'Upcoming') || trips[0];
  const otherTrips = trips.filter((t) => t.id !== upcomingTrip?.id).slice(0, 3);

  const totalSpentAcrossAll = trips.reduce(
    (acc, t) => acc + t.expenses.reduce((eAcc, exp) => eAcc + exp.amount, 0),
    0
  );

  const totalBudgetAcrossAll = trips.reduce((acc, t) => acc + t.totalBudget, 0);

  const totalDestinationsVisited = trips.reduce(
    (acc, t) => acc + t.destinations.length,
    0
  );

  // Active trip budget stats
  const activeTripSpent = upcomingTrip
    ? upcomingTrip.expenses.reduce((sum, e) => sum + e.amount, 0)
    : 0;
  const activeTripBudget = upcomingTrip ? upcomingTrip.totalBudget : 30000;
  const activeSpentPercent = Math.min(
    100,
    Math.round((activeTripSpent / (activeTripBudget || 1)) * 100)
  );

  const handleSendSaarthi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saarthiInput.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user' as const, text: saarthiInput };
    const newMessages = [...saarthiMessages, userMsg];
    setSaarthiMessages(newMessages);
    const inputCopy = saarthiInput;
    setSaarthiInput('');
    setIsSaarthiThinking(true);

    try {
      const history = newMessages.map((m) => ({
        role: (m.sender === 'saarthi' ? 'model' : 'user') as 'user' | 'model',
        content: m.text,
      }));

      const botResponse = await saarthiService.sendMessage(inputCopy, {
        tripContext: upcomingTrip,
        conversationHistory: history,
        modelName: 'gemini-3.5-flash',
      });

      setSaarthiMessages((prev) => [
        ...prev,
        { id: botResponse.id, sender: 'saarthi', text: botResponse.content },
      ]);
    } catch (error) {
      console.error(error);
      setSaarthiMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'saarthi', text: 'I am here to help you plan your journey! Ask me to optimize your route or find scenic highlights.' },
      ]);
    } finally {
      setIsSaarthiThinking(false);
    }
  };

  return (
    <DashboardLayout>
      <PageContainer className="space-y-8 py-6 max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good morning, {user?.name || 'Ishan'}
            </h1>
            <p className="text-slate-300 text-sm mt-0.5 font-medium">
              Where will your next adventure take you?
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Pill */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="w-56 sm:w-64 pl-10 pr-4 py-2 bg-slate-900/70 backdrop-blur-xl border border-white/15 rounded-full text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-lg"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            <Link to="/trips/new">
              <Button
                variant="primary"
                size="md"
                className="bg-blue-600/90 hover:bg-blue-500 text-white rounded-full font-bold px-5 shadow-lg shadow-blue-600/30 text-xs sm:text-sm backdrop-blur-md border border-blue-400/30"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Plan Trip
              </Button>
            </Link>
          </div>
        </header>

        {/* Section 1: Hero Showcase & Budget Status */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hero Featured Trip Card (Col Span 2) */}
          {upcomingTrip && (
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 group min-h-[300px] flex flex-col justify-end bg-slate-950/80 backdrop-blur-xl">
              <SafeImage
                src={upcomingTrip.coverImage}
                alt={upcomingTrip.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                fallbackSrc={DEFAULT_FALLBACK_IMAGE}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-end pointer-events-none">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-slate-200 text-xs sm:text-sm font-medium">
                    {formatDateRange(upcomingTrip.startDate, upcomingTrip.endDate)}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
                  {upcomingTrip.name}
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/20">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">
                        Stops
                      </p>
                      <p className="font-bold text-white text-sm sm:text-base">
                        {upcomingTrip.destinations.length} Cities ({upcomingTrip.destinations.slice(0, 2).join(', ')})
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">
                        Current Stop
                      </p>
                      <p className="font-bold text-white text-sm sm:text-base flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {upcomingTrip.destinations[0] || 'Mumbai'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pointer-events-auto">
                    <div className="flex flex-col items-end">
                      <div className="w-28 sm:w-32 h-1.5 bg-white/20 rounded-full mb-1 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(25, activeSpentPercent)}%` }}
                        ></div>
                      </div>
                      <p className="text-slate-200 text-[10px] font-medium">
                        {Math.max(25, activeSpentPercent)}% Complete
                      </p>
                    </div>

                    <Link to={`/trips/${upcomingTrip.id}`}>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg border border-blue-400/30 transition-all cursor-pointer">
                        View Trip
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget Status Card */}
          <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/15 text-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg text-white">Budget Status</h4>
                <p className="text-xs text-slate-300">Active journey expenses</p>
              </div>
              <Link to={upcomingTrip ? `/trips/${upcomingTrip.id}/budget` : '/trips'}>
                <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors" title="View details">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Circular Gauge */}
            <div className="relative flex justify-center py-4">
              <div className="w-32 h-32 rounded-full border-[12px] border-blue-500 border-t-slate-800 flex items-center justify-center rotate-45 shadow-inner">
                <div className="-rotate-45 flex flex-col items-center">
                  <span className="text-2xl font-black italic text-white">
                    ₹{(activeTripSpent / 1000).toFixed(0)}k
                  </span>
                  <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                    Spent
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown stats */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-300 font-medium">Total Budget</span>
                <span className="font-bold text-white">
                  {formatCurrency(activeTripBudget, 'INR')}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-300 font-medium">Remaining</span>
                <span className="text-emerald-400 font-bold">
                  {formatCurrency(Math.max(0, activeTripBudget - activeTripSpent), 'INR')}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-300 font-medium">Food & Fun Est.</span>
                <span className="text-amber-400 font-semibold">+₹2,400 est.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Journey Map Preview & Travel Saarthi AI Card */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Journey Map Card (Col span 8) */}
          <div className="lg:col-span-8 bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/15 text-white flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-lg text-white">Journey Map</h4>
                <p className="text-xs text-slate-300">Visual route & waypoint checkpoints</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-slate-200 backdrop-blur-md">
                  Day 3: {upcomingTrip?.destinations[0] || 'Mumbai'}
                </span>
                <Link to={upcomingTrip ? `/trips/${upcomingTrip.id}/map` : '/map'}>
                  <Button variant="outline" size="sm" className="rounded-full text-xs font-bold border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                    Full Map
                  </Button>
                </Link>
              </div>
            </div>

            {/* Map Visualizer Box */}
            <div className="flex-1 min-h-[220px] rounded-2xl bg-slate-950/80 relative overflow-hidden border border-white/10 backdrop-blur-md">
              <SafeImage
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover opacity-35"
                alt="Map Preview"
                fallbackSrc={DEFAULT_FALLBACK_IMAGE}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-full h-full p-8 sm:p-12" viewBox="0 0 400 200" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="6 6">
                  <path d="M50,150 Q150,50 250,120 T350,80" />
                  <circle cx="50" cy="150" r="6" fill="#0F172A" stroke="white" strokeWidth="2" />
                  <circle cx="250" cy="120" r="10" fill="#3B82F6" stroke="white" strokeWidth="3" />
                  <circle cx="350" cy="80" r="6" fill="#F59E0B" stroke="white" strokeWidth="2" />
                </svg>

                {/* Animated Location Badge Pin */}
                <div className="absolute top-[80px] left-[55%] -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-2xl border border-white/20 animate-bounce pointer-events-auto flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-400/30">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-black text-white block leading-none">
                      {upcomingTrip?.destinations[0] || 'Gateway of India'}
                    </span>
                    <span className="text-[9px] text-slate-300 font-medium">Checkpoint 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Travel Saarthi Dark AI Companion Card (Col span 4) */}
          <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-blue-500/30 flex flex-col text-white justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse shadow-md shadow-blue-400"></span>
                Travel Saarthi
              </h4>
              <Link to="/travel-saarthi" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                <span>Expand</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Message Stream */}
            <div className="flex-1 space-y-3 my-4 overflow-y-auto max-h-[190px] pr-1">
              {saarthiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.sender === 'saarthi'
                      ? 'bg-white/10 backdrop-blur-md p-3 rounded-2xl mr-6 text-xs text-slate-200 leading-relaxed border border-white/10'
                      : 'bg-blue-600/90 backdrop-blur-md p-3 rounded-2xl ml-6 text-right text-xs text-white font-medium shadow-md border border-blue-400/30'
                  }
                >
                  <p>{msg.text}</p>
                </div>
              ))}
              {isSaarthiThinking && (
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl mr-6 text-xs italic text-slate-300 flex items-center gap-2 border border-white/10">
                  <Sparkles className="w-3 h-3 text-blue-400 animate-spin" />
                  <span>Saarthi is thinking...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Input */}
            <form onSubmit={handleSendSaarthi} className="relative mt-auto">
              <input
                type="text"
                placeholder="Ask anything about your route..."
                value={saarthiInput}
                onChange={(e) => setSaarthiInput(e.target.value)}
                className="w-full py-2.5 pl-4 pr-11 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 w-7 h-7 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white transition-colors shadow-md cursor-pointer"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        {/* Section 3: All Adventures Grid */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Your Adventures
              </h2>
              <p className="text-xs text-slate-300">Manage and customize your itineraries</p>
            </div>
            <Link
              to="/trips"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All ({trips.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDuplicate={duplicateTrip}
                onDelete={deleteTrip}
              />
            ))}
          </div>
        </section>

        {/* Section 4: Trending Destinations */}
        <section className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Trending Destinations
              </h2>
              <p className="text-xs text-slate-300">Top-rated spots for your next getaway</p>
            </div>
            <Link
              to="/explore"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Explore All Cities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCities.slice(0, 3).map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </section>
      </PageContainer>
    </DashboardLayout>
  );
};

