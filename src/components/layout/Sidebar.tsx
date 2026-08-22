import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Plane,
  Compass,
  Sparkles,
  Camera,
  MapPin,
  User,
  Settings,
  PlusCircle,
  Calendar,
  Wallet,
  Globe2,
  Shield,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  tripId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ tripId }) => {
  const mainLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/trips', label: 'My Trips', icon: Plane },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/map', label: 'Route Map', icon: MapPin },
    { to: '/memories', label: 'Memories', icon: Camera },
  ];

  const toolLinks = [
    { to: '/travel-saarthi', label: 'Travel Saarthi', icon: Sparkles, isAi: true },
    { to: '/trips/new', label: 'Plan New Trip', icon: PlusCircle },
  ];

  const secondaryLinks = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/admin', label: 'Admin Analytics', icon: Shield },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-slate-900/60 backdrop-blur-2xl text-white border-r border-white/10 min-h-[calc(100vh-4rem)] p-6 justify-between select-none shadow-2xl">
      <div className="space-y-6">
        {/* Navigation items */}
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </span>
          <nav className="mt-3 space-y-1">
            {mainLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group border border-transparent',
                      isActive
                        ? 'bg-blue-600/80 backdrop-blur-md text-white font-semibold shadow-lg shadow-blue-600/25 border-blue-400/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Tools */}
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Tools & AI
          </span>
          <nav className="mt-3 space-y-1">
            {toolLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group border',
                      item.isAi &&
                        'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-md text-blue-200 border-blue-400/40 hover:border-blue-300 shadow-md shadow-blue-900/20',
                      !item.isAi &&
                        (isActive
                          ? 'bg-blue-600/80 backdrop-blur-md text-white font-semibold shadow-lg shadow-blue-600/25 border-blue-400/40'
                          : 'text-slate-300 hover:text-white hover:bg-white/10 border-transparent')
                    )
                  }
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                      item.isAi && 'text-blue-300'
                    )}
                  />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Active Trip Context Subnav */}
        {tripId && (
          <div className="pt-4 border-t border-white/10">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Trip View
            </span>
            <nav className="mt-2 space-y-1">
              <NavLink
                to={`/trips/${tripId}`}
                end
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border',
                    isActive
                      ? 'bg-blue-600/30 text-blue-200 font-bold border-blue-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  )
                }
              >
                <Plane className="w-3.5 h-3.5" />
                Overview
              </NavLink>
              <NavLink
                to={`/trips/${tripId}/itinerary`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border',
                    isActive
                      ? 'bg-blue-600/30 text-blue-200 font-bold border-blue-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  )
                }
              >
                <Calendar className="w-3.5 h-3.5" />
                Itinerary Builder
              </NavLink>
              <NavLink
                to={`/trips/${tripId}/budget`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border',
                    isActive
                      ? 'bg-blue-600/30 text-blue-200 font-bold border-blue-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  )
                }
              >
                <Wallet className="w-3.5 h-3.5" />
                Budget & Expenses
              </NavLink>
              <NavLink
                to={`/trips/${tripId}/map`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border',
                    isActive
                      ? 'bg-blue-600/30 text-blue-200 font-bold border-blue-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  )
                }
              >
                <MapPin className="w-3.5 h-3.5" />
                Route Map
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Travel Saarthi Promo Card & Account */}
      <div className="space-y-4 pt-6">
        <div className="bg-gradient-to-br from-blue-600/80 to-indigo-700/80 backdrop-blur-md p-4 rounded-2xl relative overflow-hidden shadow-xl border border-white/20">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Travel Saarthi
            </p>
            <p className="text-xs text-white/95 mb-3 font-medium">
              Ready for your next adventure?
            </p>
            <Link to="/travel-saarthi">
              <button className="w-full py-2 bg-white/95 hover:bg-white text-blue-700 text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98]">
                Start Planning
              </button>
            </Link>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/15 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Secondary Links */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          {secondaryLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )
                }
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

