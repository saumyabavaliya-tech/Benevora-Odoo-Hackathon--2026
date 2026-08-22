import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ListTodo,
  Navigation,
  PieChart,
  Sparkles,
  Share2,
  Trash2,
  Copy,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { TripHeader } from '../components/trip/TripHeader';
import { TripStats } from '../components/trip/TripStats';
import { TripProgress } from '../components/trip/TripProgress';
import { StopCard } from '../components/itinerary/StopCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { formatCurrency } from '../lib/utils';

export const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { getTrip, deleteTrip, duplicateTrip } = useTrips();
  const trip = getTrip(tripId || '');

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!trip) {
    return (
      <DashboardLayout>
        <PageContainer className="text-center py-20">
          <h2 className="text-xl font-bold text-slate-800">Trip not found</h2>
          <p className="text-xs text-slate-500 mt-1">This journey may have been deleted or archived.</p>
          <Link to="/trips" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Back to My Trips</Button>
          </Link>
        </PageContainer>
      </DashboardLayout>
    );
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/shared/${trip.shareId || 'gt-share-123'}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <DashboardLayout tripId={trip.id}>
      <PageContainer className="space-y-8">
        {/* Cover & Main Header */}
        <TripHeader
          trip={trip}
          onShare={() => setShareModalOpen(true)}
        />

        {/* 4 Stats Cards */}
        <TripStats trip={trip} />

        {/* Trip Readiness & Progress */}
        <TripProgress trip={trip} />

        {/* Grid Layout: Stops & Itinerary Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Stops Sequential Chain */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Destination Route</h3>
                <p className="text-xs text-slate-500">{trip.stops.length} Stops planned</p>
              </div>
              <Link to={`/trips/${trip.id}/map`}>
                <span className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                  View Map <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            <div className="space-y-2">
              {trip.stops.map((stop, idx) => (
                <StopCard key={stop.id} stop={stop} isLast={idx === trip.stops.length - 1} />
              ))}
            </div>
          </div>

          {/* Right: Itinerary Preview & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Itinerary Schedule</h3>
                <p className="text-xs text-slate-500">{trip.itinerary.length} Activities & Events</p>
              </div>
              <Link to={`/trips/${trip.id}/itinerary`}>
                <Button variant="primary" size="sm" leftIcon={<ListTodo className="w-3.5 h-3.5" />}>
                  Open Builder
                </Button>
              </Link>
            </div>

            <div className="space-y-2.5">
              {trip.itinerary.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      D{item.dayNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.time} • {item.locationName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {formatCurrency(item.estimatedCost, item.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {shareModalOpen && (
          <Modal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            title="Share Trip Plan"
            description="Invite friends or share your itinerary with others."
          >
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/shared/${trip.shareId || 'gt-share-123'}`}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                />
                <Button onClick={handleCopyLink} variant="primary" size="sm">
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};
