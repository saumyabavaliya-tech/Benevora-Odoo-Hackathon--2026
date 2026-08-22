import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  MapPin,
  Plane,
  Calendar,
  Wallet,
  ShieldCheck,
  Star,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/common/Button';
import { mockCities, mockTrips } from '../data/mockData';
import { formatCurrency } from '../lib/utils';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../components/ui/SafeImage';

export const Landing: React.FC = () => {
  const [activeStop, setActiveStop] = React.useState<number>(2);

  const routeStops = [
    {
      id: 1,
      name: 'Ahmedabad',
      state: 'Gujarat',
      tag: 'Day 1-2 • Heritage',
      activity: 'Sabarmati & Heritage Walk',
      location: 'Old City • 09:00 AM',
      cost: '₹6,500',
      image: 'https://images.unsplash.com/photo-1596405835955-470a7d2b406b?auto=format&fit=crop&w=300&q=80',
      x: 85,
      y: 65,
      color: '#3B82F6',
    },
    {
      id: 2,
      name: 'Mumbai',
      state: 'Maharashtra',
      tag: 'Day 3-4 • Coastal City',
      activity: 'Gateway of India & Colaba',
      location: 'South Mumbai • 04:30 PM',
      cost: '₹11,500',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=300&q=80',
      x: 260,
      y: 135,
      color: '#6366F1',
    },
    {
      id: 3,
      name: 'Goa',
      state: 'Goa',
      tag: 'Day 5-6 • Beach Life',
      activity: 'Sunset Catamaran Sailing',
      location: 'Mandovi Bay • 05:00 PM',
      cost: '₹12,000',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80',
      x: 435,
      y: 215,
      color: '#10B981',
    },
  ];

  const currentStopData = routeStops[activeStop];
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background Gradients & World Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/50 via-indigo-600/30 to-purple-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-blue-500/20 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Text Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs font-bold backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Next-Gen Travel Planning Companion</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
              >
                Your journey. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Your story.
                </span>{' '}
                <br />
                Your way.
              </motion.h1>

              {/* Supporting Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              >
                Plan unforgettable multi-city adventures with intelligent recommendations,
                interactive itineraries, dynamic budget trackers, and your personal AI travel
                companion — <strong>Travel Saarthi</strong>.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
              >
                <Link to="/trips/new">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Plan My Trip
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-semibold text-base"
                  >
                    Explore Destinations
                  </Button>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-6 border-t border-slate-800 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Multi-City Route Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time Budget Charts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Map & DND</span>
                </div>
              </motion.div>
            </div>

            {/* Right Visual Stage: Animated Interactive Route Canvas */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/70 p-6 shadow-2xl backdrop-blur-md overflow-hidden"
              >
                {/* Visual Trip Simulation Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-300 ml-2">
                      Live Route: Ahmedabad ➔ Mumbai ➔ Goa
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                    6 Days • ₹30,000
                  </span>
                </div>

                {/* Animated Route Display */}
                <div className="relative h-72 sm:h-80 w-full my-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 overflow-hidden flex items-center justify-center select-none">
                  {/* Subtle map grid background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                  {/* SVG Route Line and Synchronized Waypoints */}
                  <svg
                    viewBox="0 0 540 280"
                    className="w-full h-full relative z-10"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                      <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Glow Underlay */}
                    <path
                      d="M 85,75 C 160,75 180,140 260,140 C 340,140 360,210 435,210"
                      fill="none"
                      stroke="url(#routeGrad)"
                      strokeWidth="8"
                      strokeOpacity="0.25"
                      filter="url(#routeGlow)"
                    />

                    {/* Base Track */}
                    <path
                      d="M 85,75 C 160,75 180,140 260,140 C 340,140 360,210 435,210"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      strokeOpacity="0.6"
                    />

                    {/* Active Animated Route Path */}
                    <motion.path
                      d="M 85,75 C 160,75 180,140 260,140 C 340,140 360,210 435,210"
                      fill="none"
                      stroke="url(#routeGrad)"
                      strokeWidth="3.5"
                      strokeDasharray="8 6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.8, ease: 'easeInOut' }}
                    />

                    {/* Transit Badges on Segments */}
                    <g transform="translate(170, 96)">
                      <rect x="-38" y="-10" width="76" height="20" rx="10" fill="#0F172A" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.5" />
                      <text x="0" y="3" textAnchor="middle" fill="#93C5FD" fontSize="9.5" fontWeight="700">530 km • ✈ 1h</text>
                    </g>
                    <g transform="translate(350, 166)">
                      <rect x="-38" y="-10" width="76" height="20" rx="10" fill="#0F172A" stroke="#10B981" strokeWidth="1" strokeOpacity="0.5" />
                      <text x="0" y="3" textAnchor="middle" fill="#6EE7B7" fontSize="9.5" fontWeight="700">585 km • ✈ 1h</text>
                    </g>

                    {/* City Stops */}
                    {routeStops.map((stop, idx) => {
                      const isSelected = activeStop === idx;
                      return (
                        <g
                          key={stop.id}
                          className="cursor-pointer transition-transform"
                          onClick={() => setActiveStop(idx)}
                        >
                          {/* Pulsing Aura */}
                          {isSelected && (
                            <circle
                              cx={stop.x}
                              cy={stop.y}
                              r="20"
                              fill={stop.color}
                              fillOpacity="0.25"
                              className="animate-pulse"
                            />
                          )}
                          <circle
                            cx={stop.x}
                            cy={stop.y}
                            r="14"
                            fill="#0F172A"
                            stroke={stop.color}
                            strokeWidth={isSelected ? 3 : 2}
                          />
                          <circle
                            cx={stop.x}
                            cy={stop.y}
                            r="9"
                            fill={stop.color}
                          />
                          <text
                            x={stop.x}
                            y={stop.y + 3.5}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="10"
                            fontWeight="900"
                          >
                            {stop.id}
                          </text>

                          {/* City Label Badge */}
                          <g transform={`translate(${stop.x}, ${idx === 0 ? stop.y - 32 : idx === 1 ? stop.y - 32 : stop.y + 34})`}>
                            <rect
                              x="-44"
                              y="-12"
                              width="88"
                              height="24"
                              rx="8"
                              fill="#0F172A"
                              stroke={isSelected ? stop.color : '#334155'}
                              strokeWidth={isSelected ? '1.5' : '1'}
                              fillOpacity="0.95"
                            />
                            <text
                              x="0"
                              y="3.5"
                              textAnchor="middle"
                              fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                              fontSize="11"
                              fontWeight="800"
                            >
                              {stop.name}
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* Animated Traveling Flight Indicator */}
                    <motion.g
                      animate={{
                        x: [85, 260, 435, 260, 85],
                        y: [75, 140, 210, 140, 75],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <circle cx="0" cy="0" r="11" fill="#FFFFFF" filter="url(#routeGlow)" />
                      <g transform="translate(-6, -6) scale(0.6)">
                        <path
                          d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                          fill="#2563EB"
                        />
                      </g>
                    </motion.g>
                  </svg>
                </div>

                {/* Dynamic Activity Card Preview according to activeStop */}
                <motion.div
                  key={currentStopData.name}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="bg-slate-800/90 rounded-2xl p-3.5 border border-slate-700/80 flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SafeImage
                      src={currentStopData.image}
                      alt={currentStopData.activity}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                      fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/40">
                          {currentStopData.tag}
                        </span>
                        <span className="text-[10px] text-slate-400">Click stops to inspect</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-0.5">{currentStopData.activity}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{currentStopData.location}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs font-black text-emerald-400">{currentStopData.cost}</span>
                    <span className="text-[10px] text-slate-400 block">Est. Stop Cost</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Crafted for Modern Explorers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Everything you need to orchestrate epic journeys
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              From multi-city logistics and draggable itineraries to AI-guided budget control and
              cinematic photo memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-City Route Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect destinations seamlessly. Plan stops, transit hours, and accommodation stays
                with visual route maps.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Travel Saarthi AI</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your conversational AI co-pilot. Optimize hectic schedules, find hidden food spots,
                and tune trips to your travel vibe.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Budget & Chart Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Visual expense breakdown with interactive donut and bar charts. Avoid surprises with
                instant over-budget alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="py-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to embark on your next adventure?
          </h2>
          <p className="text-base text-blue-100 max-w-xl mx-auto">
            Join thousands of travelers crafting bespoke journeys across the globe with GlobeTrotter.
          </p>
          <div className="pt-2">
            <Link to="/trips/new">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-base shadow-xl"
                rightIcon={<ArrowRight className="w-5 h-5 text-blue-600" />}
              >
                Start Planning Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 GlobeTrotter. "Plan the journey. Feel the adventure." Built for modern explorers.</p>
      </footer>
    </div>
  );
};
