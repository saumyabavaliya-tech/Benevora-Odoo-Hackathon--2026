import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation, MapPin, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { MapView } from '../components/map/MapView';
import { MapTripPanel } from '../components/map/MapTripPanel';
import { Button } from '../components/common/Button';

export const JourneyMap: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, getTrip } = useTrips();
  const trip = tripId ? getTrip(tripId) : trips[0];

  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  if (!trip) {
    return (
      <DashboardLayout>
        <PageContainer className="text-center py-20">
          <h2 className="text-lg font-bold text-slate-800">No active journey map found</h2>
          <Link to="/trips" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Back to My Trips</Button>
          </Link>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout tripId={trip.id}>
      <PageContainer className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Link to={`/trips/${trip.id}`} className="hover:underline">
                {trip.name}
              </Link>
              <span>/</span>
              <span>Interactive Map</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Journey Route Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live geographic visualization: {trip.destinations.join('  ⟶  ')}
            </p>
          </div>

          <Link to={`/trips/${trip.id}/itinerary`}>
            <Button variant="outline" size="sm">
              Open Itinerary Builder
            </Button>
          </Link>
        </div>

        {/* Map Layout: Left Side Panel + Right React Leaflet Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Stops List Panel */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <MapTripPanel
              trip={trip}
              selectedCity={selectedCity}
              onSelectCity={(city) => setSelectedCity(city)}
            />
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <MapView
              trip={trip}
              selectedCityId={selectedCity || undefined}
              onSelectCity={(cityName) => setSelectedCity(cityName)}
              className="h-[580px] w-full"
            />
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};
