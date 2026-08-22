import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Compass, Calendar, MapPin, Wallet, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <PageContainer className="space-y-8 py-8">
        {/* Banner with Clone Action */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Shared Journey Itinerary
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">{trip.name}</h1>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-blue-100">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-300" />
                {trip.destinations.join(' ➔ ')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-300" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleCloneTrip}
            variant="secondary"
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold shadow-lg"
            rightIcon={<ArrowRight className="w-5 h-5 text-blue-600" />}
          >
            Copy Trip to My Account
          </Button>
        </div>

        {/* Map & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Map Preview */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Geographic Route</h3>
            <MapView trip={trip} className="h-80 w-full" />
          </div>

          {/* Right: Full Day Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Schedule & Activities</h3>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <ItineraryTimeline items={trip.itinerary} currency={trip.currency} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
