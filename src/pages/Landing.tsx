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

// Cubic bezier point & angle evaluation
function getCubicBezier(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number
) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  const x = mt3 * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t3 * p3[0];
  const y = mt3 * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t3 * p3[1];

  const dx = 3 * mt2 * (p1[0] - p0[0]) + 6 * mt * t * (p2[0] - p1[0]) + 3 * t2 * (p3[0] - p2[0]);
  const dy = 3 * mt2 * (p1[1] - p0[1]) + 6 * mt * t * (p2[1] - p1[1]) + 3 * t2 * (p3[1] - p2[1]);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return { x, y, angle };
}

function getFlightRoutePoint(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.5) {
    const t = p / 0.5;
    return getCubicBezier([85, 75], [175, 75], [185, 140], [265, 140], t);
  } else {
    const t = (p - 0.5) / 0.5;
    return getCubicBezier([265, 140], [345, 140], [365, 205], [440, 205], t);
  }
}

export const Landing: React.FC = () => {
  const [activeStop, setActiveStop] = React.useState<number>(1);
  const [flightProgress, setFlightProgress] = React.useState<number>(0.5);

  const routeStops = [
    {
      id: 1,
      name: 'Ahmedabad',
      state: 'Gujarat',
      tag: 'Day 1-2 • Heritage',
      activity: 'Adalaj Stepwell & Sabarmati',
      location: 'Old City • 09:00 AM',
      cost: '₹6,500',
      weather: '☀️ 31°C',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      x: 85,
      y: 75,
      color: '#38BDF8',
      targetProgress: 0.05,
    },
    {
      id: 2,
      name: 'Mumbai',
      state: 'Maharashtra',
      tag: 'Day 3-4 • Coastal City',
      activity: 'Gateway of India & Colaba',
      location: 'South Mumbai • 04:30 PM',
      cost: '₹11,500',
      weather: '⛅ 28°C',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=300&q=80',
      x: 265,
      y: 140,
      color: '#818CF8',
      targetProgress: 0.5,
    },
    {
      id: 3,
      name: 'Goa',
      state: 'Goa',
      tag: 'Day 5-6 • Beach Life',
      activity: 'Sunset Catamaran Sailing',
      location: 'Mandovi Bay • 05:00 PM',
      cost: '₹12,000',
      weather: '🌴 29°C',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80',
      x: 440,
      y: 205,
      color: '#34D399',
      targetProgress: 0.95,
    },
  ];

  // Smooth continuous flight progression
  React.useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const updateFlight = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setFlightProgress((prev) => {
        const next = (prev + delta * 0.075) % 1;
        if (next < 0.28) {
          setActiveStop(0);
        } else if (next < 0.72) {
          setActiveStop(1);
        } else {
          setActiveStop(2);
        }
        return next;
      });
      animFrame = requestAnimationFrame(updateFlight);
    };

    animFrame = requestAnimationFrame(updateFlight);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const currentFlightPos = getFlightRoutePoint(flightProgress);
  const currentStopData = routeStops[activeStop];

  const handleSelectStop = (idx: number) => {
    setActiveStop(idx);
    setFlightProgress(routeStops[idx].targetProgress);
  };
  return (
    <div className="min-h-screen relative bg-slate-950 text-white flex flex-col selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* High-res Atmospheric Blurred Background Wallpaper */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-60"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        {/* Layered Backdrop Blur, Atmospheric Gradients & Radial Shimmers */}
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/70 to-slate-950" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/40 via-indigo-600/30 to-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Hero Text Content */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* Pill badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/50 border border-blue-400/30 text-blue-200 text-xs font-bold backdrop-blur-xl shadow-lg shadow-blue-900/20"
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
                      className="bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 backdrop-blur-md border border-blue-400/40"
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Plan My Trip
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xl font-semibold text-base shadow-lg"
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
                  className="pt-6 border-t border-white/10 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-300"
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
                  className="relative rounded-3xl bg-slate-900/70 border border-white/15 p-6 shadow-2xl backdrop-blur-2xl overflow-hidden"
                >
                  {/* Visual Trip Simulation Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-200 ml-2">
                        Live Route: Ahmedabad ➔ Mumbai ➔ Goa
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/40 backdrop-blur-md">
                      6 Days • ₹30,000
                    </span>
                  </div>

                  {/* Animated Route Display */}
                  <div className="relative h-72 sm:h-80 w-full my-4 rounded-2xl bg-slate-950/80 border border-white/10 overflow-hidden flex items-center justify-center select-none backdrop-blur-md shadow-inner">
                    {/* Subtle Dot Matrix Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

                    {/* SVG Route Line, Distances, Stops and Smooth Airplane */}
                    <svg
                      viewBox="0 0 530 280"
                      className="w-full h-full relative z-10"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        {/* Route Gradient */}
                        <linearGradient id="cleanRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38BDF8" />
                          <stop offset="50%" stopColor="#818CF8" />
                          <stop offset="100%" stopColor="#34D399" />
                        </linearGradient>

                        {/* Subtle Route Glow */}
                        <filter id="softRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Dashed Background Guide Track */}
                      <path
                        d="M 85,75 C 175,75 185,140 265,140 C 345,140 365,205 440,205"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="2.5"
                        strokeDasharray="4 6"
                      />

                      {/* Main Glowing Route Path */}
                      <path
                        d="M 85,75 C 175,75 185,140 265,140 C 345,140 365,205 440,205"
                        fill="none"
                        stroke="url(#cleanRouteGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#softRouteGlow)"
                      />

                      {/* Animated Pulse along Route */}
                      <motion.path
                        d="M 85,75 C 175,75 185,140 265,140 C 345,140 365,205 440,205"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray="16 160"
                        animate={{ strokeDashoffset: [0, -352] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />

                      {/* Distance & Travel Time Badges */}
                      {/* Leg 1: Ahmedabad -> Mumbai */}
                      <g transform="translate(175, 96)">
                        <rect
                          x="-48"
                          y="-11"
                          width="96"
                          height="22"
                          rx="11"
                          fill="#090D16"
                          stroke="#38BDF8"
                          strokeWidth="1"
                          strokeOpacity="0.8"
                        />
                        <text x="0" y="3.5" textAnchor="middle" fill="#BAE6FD" fontSize="9.5" fontWeight="700">
                          530 km • ✈ 1h 05m
                        </text>
                      </g>

                      {/* Leg 2: Mumbai -> Goa */}
                      <g transform="translate(355, 162)">
                        <rect
                          x="-48"
                          y="-11"
                          width="96"
                          height="22"
                          rx="11"
                          fill="#090D16"
                          stroke="#34D399"
                          strokeWidth="1"
                          strokeOpacity="0.8"
                        />
                        <text x="0" y="3.5" textAnchor="middle" fill="#A7F3D0" fontSize="9.5" fontWeight="700">
                          585 km • ✈ 1h 15m
                        </text>
                      </g>

                      {/* City Waypoints with Weather & Temperature */}
                      {routeStops.map((stop, idx) => {
                        const isSelected = activeStop === idx;
                        const labelY = idx === 2 ? stop.y + 36 : stop.y - 34;

                        return (
                          <g
                            key={stop.id}
                            className="cursor-pointer"
                            onClick={() => handleSelectStop(idx)}
                          >
                            {/* Stop Pulse Pin */}
                            <g transform={`translate(${stop.x}, ${stop.y})`}>
                              {isSelected && (
                                <circle
                                  r="16"
                                  fill="none"
                                  stroke={stop.color}
                                  strokeWidth="1.5"
                                  strokeOpacity="0.5"
                                  className="animate-ping"
                                />
                              )}
                              <circle
                                r={isSelected ? 13 : 10}
                                fill="#0B1120"
                                stroke={stop.color}
                                strokeWidth={isSelected ? 2.5 : 1.8}
                              />
                              <circle
                                r={isSelected ? 6 : 4.5}
                                fill={stop.color}
                              />
                              <text
                                x="0"
                                y="3"
                                textAnchor="middle"
                                fill="#FFFFFF"
                                fontSize="8.5"
                                fontWeight="800"
                              >
                                {stop.id}
                              </text>
                            </g>

                            {/* City Label & Weather Pill */}
                            <g transform={`translate(${stop.x}, ${labelY})`}>
                              <rect
                                x="-52"
                                y="-13"
                                width="104"
                                height="26"
                                rx="13"
                                fill="#0B132B"
                                stroke={isSelected ? stop.color : '#334155'}
                                strokeWidth={isSelected ? '1.5' : '1'}
                                fillOpacity="0.95"
                              />
                              <text
                                x="-12"
                                y="3.5"
                                textAnchor="middle"
                                fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                                fontSize="10.5"
                                fontWeight="700"
                              >
                                {stop.name}
                              </text>
                              <text
                                x="30"
                                y="3.5"
                                textAnchor="middle"
                                fill={stop.color}
                                fontSize="9"
                                fontWeight="800"
                              >
                                {stop.weather}
                              </text>
                            </g>
                          </g>
                        );
                      })}

                      {/* Smooth Gliding Airplane */}
                      <g
                        transform={`translate(${currentFlightPos.x}, ${currentFlightPos.y}) rotate(${currentFlightPos.angle})`}
                      >
                        {/* Glow halo */}
                        <circle cx="0" cy="0" r="12" fill="#38BDF8" fillOpacity="0.2" filter="url(#softRouteGlow)" />

                        {/* Airplane Vector Shape */}
                        <path
                          d="M -4,0 L -8,-12 L -3,-12 L 3,-2 L 11,-1 L 14,0 L 11,1 L 3,2 L -3,12 L -8,12 L -4,0 Z"
                          fill="#1E293B"
                          stroke="#38BDF8"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M -9,0 L -6,-2.5 L 4,-2 L 14,0 L 4,2 L -6,2.5 Z"
                          fill="#FFFFFF"
                        />
                        <ellipse cx="6" cy="0" rx="2.5" ry="1.2" fill="#0284C7" />
                      </g>
                    </svg>
                  </div>

                  {/* Dynamic Activity Card Preview according to activeStop */}
                  <motion.div
                    key={currentStopData.name}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-3.5 border border-white/15 flex items-center justify-between shadow-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <SafeImage
                        src={currentStopData.image}
                        alt={currentStopData.activity}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-white/20"
                        fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/40">
                            {currentStopData.tag}
                          </span>
                          <span className="text-[10px] text-slate-300">Click stops to inspect</span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate mt-0.5">{currentStopData.activity}</h4>
                        <p className="text-[11px] text-slate-300 truncate">{currentStopData.location}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-black text-emerald-400">{currentStopData.cost}</span>
                      <span className="text-[10px] text-slate-300 block">Est. Stop Cost</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase Grid */}
        <section className="py-20 bg-slate-950/75 backdrop-blur-2xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Crafted for Modern Explorers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Everything you need to orchestrate epic journeys
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3">
                From multi-city logistics and draggable itineraries to AI-guided budget control and
                cinematic photo memories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all group shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Multi-City Route Engine</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Connect destinations seamlessly. Plan stops, transit hours, and accommodation stays
                  with visual route maps.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all group shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Travel Saarthi AI</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Your conversational AI co-pilot. Optimize hectic schedules, find hidden food spots,
                  and tune trips to your travel vibe.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/70 transition-all group shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Budget & Chart Analytics</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Visual expense breakdown with interactive donut and bar charts. Avoid surprises with
                  instant over-budget alerts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action footer banner */}
        <section className="py-16 bg-gradient-to-r from-blue-700/90 via-indigo-700/90 to-purple-800/90 backdrop-blur-xl text-center relative overflow-hidden border-y border-white/15">
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
                  className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-base shadow-2xl hover:scale-105 transition-transform"
                  rightIcon={<ArrowRight className="w-5 h-5 text-blue-600" />}
                >
                  Start Planning Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="py-8 bg-slate-950/90 backdrop-blur-md border-t border-white/10 text-center text-xs text-slate-400">
          <p>© 2026 GlobeTrotter. "Plan the journey. Feel the adventure." Built for modern explorers.</p>
        </footer>
      </div>
    </div>
  );
};
