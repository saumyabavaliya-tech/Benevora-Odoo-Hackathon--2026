import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  MapPin,
  Wallet,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Share2,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Clock,
  Layers,
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { PageContainer } from '../components/layout/PageContainer';
import { ItineraryTimeline } from '../components/itinerary/ItineraryTimeline';
import { MapView } from '../components/map/MapView';
import { Button } from '../components/common/Button';
import { formatCurrency, formatDateRange } from '../lib/utils';

export const SharedTrip: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { trips, createTrip } = useTrips();
  const { user } = useAuth();

  const [copied, setCopied] = useState(false);
  const trip = trips.find((t) => t.shareId === shareId) || trips[0];

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">Shared Trip Not Found</h2>
        <Link to="/" className="mt-4">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCloneTrip = async () => {
    const cloned = await createTrip({
      name: `${trip.name} (My Copy)`,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      totalDays: trip.totalDays,
      destinations: trip.destinations,
      totalBudget: trip.totalBudget,
      currency: trip.currency,
      coverImage: trip.coverImage,
      travelStyles: trip.travelStyles,
      stops: trip.stops,
      itinerary: trip.itinerary,
      expenses: trip.expenses,
    });

    navigate(`/trips/${cloned.id}/itinerary`);
  };

  const shareText = encodeURIComponent(`Check out this travel itinerary: ${trip.name}!`);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      <Navbar />

      <PageContainer className="space-y-8 py-8">
        {/* Banner with Clone Action */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full">
                Public Shared Itinerary
              </span>
              <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                Read-Only View
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{trip.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{trip.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-blue-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                {trip.destinations.join(' ➔ ')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                {formatDateRange(trip.startDate, trip.endDate)} ({trip.totalDays} Days)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Wallet className="w-4 h-4 text-emerald-400" />
                {formatCurrency(trip.totalBudget, trip.currency)} Est. Budget
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Button
              onClick={handleCloneTrip}
              variant="primary"
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-lg shadow-blue-600/30 border border-blue-400/30"
              rightIcon={<ArrowRight className="w-5 h-5 text-white" />}
            >
              Copy Trip to My Account
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="md"
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Link Copied to Clipboard!' : 'Copy Shareable Link'}
            </Button>
          </div>
        </div>

        {/* Social Media Sharing Strip */}
        <div className="bg-slate-900/70 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-white/15 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>Share this itinerary with friends & fellow travelers:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-500/30 transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" />
              Twitter
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-400/30 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600/30 transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" />
              Facebook
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-500/30 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(trip.name)}&body=${shareText}%20${encodedUrl}`}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-white/10 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
          </div>
        </div>

        {/* Map & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Map Preview */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-white">Geographic Route & Stops</h3>
            <MapView trip={trip} className="h-80 w-full rounded-3xl border border-white/15 shadow-xl" />
          </div>

          {/* Right: Full Day Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-white">Day-by-Day Schedule ({trip.itinerary.length} Activities)</h3>
            <div className="bg-slate-900/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-xl">
              <ItineraryTimeline items={trip.itinerary} currency={trip.currency} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
