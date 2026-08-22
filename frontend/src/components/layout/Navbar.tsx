import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bell,
  MapPin,
  Camera,
  Layers,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Settings,
  PlusCircle,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockNotifications } from '../../data/mockData';
import { Button } from '../common/Button';
import { SafeImage } from '../ui/SafeImage';
import { BrandLogo } from '../common/BrandLogo';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/trips', label: 'My Trips' },
    { to: '/explore', label: 'Explore' },
    { to: '/map', label: 'Map' },
    { to: '/memories', label: 'Memories' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/75 backdrop-blur-xl border-b border-white/10 text-white transition-all shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center group">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/80 backdrop-blur-md text-white font-semibold shadow-xs border border-blue-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Travel Saarthi CTA Button */}
            <Link to="/travel-saarthi">
              <Button
                variant="accent"
                size="sm"
                leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
                className="bg-gradient-to-r from-[#2563EB]/90 to-[#1D4ED8]/90 backdrop-blur-md border border-blue-400/30 text-white font-bold shadow-md shadow-blue-600/30 hover:brightness-110"
              >
                <span className="hidden sm:inline">Ask </span>Saarthi AI
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowProfileMenu(false);
                    }}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 relative transition-colors border border-transparent hover:border-white/10"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <h4 className="font-bold text-white text-sm">Notifications</h4>
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium border border-blue-500/30">
                          {unreadCount} new
                        </span>
                      </div>
                      <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-2">
                        {mockNotifications.map((n) => (
                          <div
                            key={n.id}
                            className="py-2.5 px-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                          >
                            <p className="text-xs font-semibold text-white">{n.title}</p>
                            <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar & Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-400/50 transition-all"
                  >
                    <SafeImage
                      src={user?.avatar}
                      alt={user?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                      fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-2 z-50">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 rounded-xl"
                      >
                        <Layers className="w-4 h-4 text-blue-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 rounded-xl"
                      >
                        <UserIcon className="w-4 h-4 text-blue-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 rounded-xl"
                      >
                        <Settings className="w-4 h-4 text-blue-400" />
                        Settings
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 rounded-xl"
                      >
                        <Shield className="w-4 h-4 text-blue-400" />
                        Admin Analytics
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20 rounded-xl mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white hover:bg-white/10">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="bg-blue-600/90 backdrop-blur-md border border-blue-400/30 text-white shadow-md shadow-blue-600/20">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white md:hidden hover:bg-white/10"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30' : 'text-slate-300 hover:bg-white/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link to="/trips/new" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full bg-blue-600/90 backdrop-blur-md border border-blue-400/30 shadow-lg" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Plan New Trip
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
