import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Navigation,
  MapPin,
  Sparkles,
  Layers,
  ArrowRight,
  Search,
  Compass,
  Calendar,
  Wallet,
  Globe2,
  ChevronRight,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { MapView } from '../components/map/MapView';
import { MapTripPanel } from '../components/map/MapTripPanel';
import { Button } from '../components/common/Button';
import { mockCities } from '../data/mockData';
import { formatCurrency } from '../lib/utils';

export const JourneyMap: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, getTrip } = useTrips();

  // Mode: either a specific trip ID or 'all' for All India Destinations
  const [selectedMode, setSelectedMode] = useState<string>(tripId || (trips[0]?.id || 'all'));
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState<string>('');
  const [centerOverride, setCenterOverride] = useState<[number, number] | null>(null);

  // Determine current active trip if mode is a trip ID
  const currentTrip = useMemo(() => {
    if (selectedMode === 'all') return null;
    return getTrip(selectedMode) || trips.find((t) => t.id === selectedMode) || trips[0] || null;
  }, [selectedMode, trips, getTrip]);

  // Filtered mock cities for the exploration panel
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return mockCities;
    const query = citySearch.toLowerCase();
    return mockCities.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query) ||
        c.climate.toLowerCase().includes(query)
    );
  }, [citySearch]);

  const handleSelectCityFromList = (cityName: string, lat: number, lng: number) => {
    setSelectedCity(cityName);
    setCenterOverride([lat, lng]);
  };

  return (
    <DashboardLayout tripId={currentTrip?.id}>
      <PageContainer className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <Link to="/trips" className="hover:underline text-slate-300">
                Journeys
              </Link>
              <span className="text-slate-500">/</span>
              <span>Interactive Route & Destination Map</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-blue-400 shrink-0" />
              {currentTrip ? currentTrip.name : 'India Travel & Destination Explorer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {currentTrip
                ? `Sequential itinerary route: ${currentTrip.destinations.join('  ⟶  ')}`
                : 'Explore top heritage, coastal, and scenic destinations plotted across the Indian subcontinent.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {currentTrip ? (
              <Link to={`/trips/${currentTrip.id}/itinerary`}>
                <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500 font-bold shadow-lg shadow-blue-600/30">
                  Open Itinerary Builder
                </Button>
              </Link>
            ) : (
              <Link to="/trips/new">
                <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500 font-bold shadow-lg shadow-blue-600/30">
                  Plan New Journey
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Trip Switcher Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-slate-900/70 backdrop-blur-2xl p-2.5 rounded-2xl border border-white/15 shadow-xl scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 shrink-0">
            View Map:
          </span>

          <button
            type="button"
            onClick={() => {
              setSelectedMode('all');
              setSelectedCity(null);
              setCenterOverride(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedMode === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-300" />
            All India Destinations ({mockCities.length})
          </button>

          {trips.map((t) => {
            const isSelected = selectedMode === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSelectedMode(t.id);
                  setSelectedCity(null);
                  if (t.stops[0]) {
                    setCenterOverride([t.stops[0].lat, t.stops[0].lng]);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.name}</span>
                <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full text-blue-200">
                  {t.stops.length} stops
                </span>
              </button>
            );
          })}
        </div>

        {/* Map Layout: Side Panel (4 cols) + Interactive Leaflet Map (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Trip Sequential Stops or All Destinations List */}
          <div className="lg:col-span-4 order-2 lg:order-1 space-y-4">
            {currentTrip ? (
              <MapTripPanel
                trip={currentTrip}
                selectedCity={selectedCity}
                onSelectCity={(city) => {
                  setSelectedCity(city);
                  const foundStop = currentTrip.stops.find((s) => s.cityName.toLowerCase() === city.toLowerCase());
                  if (foundStop) {
                    setCenterOverride([foundStop.lat, foundStop.lng]);
                  }
                }}
              />
            ) : (
              /* All Destinations Explorer Panel */
              <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-5 border border-white/15 shadow-xl space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Subcontinent Destinations
                  </span>
                  <h3 className="text-lg font-black text-white tracking-tight mt-1">
                    Featured Travel Hubs
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Click any destination to fly to its geographic marker on the live map.
                  </p>
                </div>

                {/* City Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Search city, region, climate..."
                    className="w-full pl-10 pr-3 py-2 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                {/* Cities Scrollable List */}
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredCities.map((c) => {
                    const isSelected = selectedCity === c.name;
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCityFromList(c.name, c.lat, c.lng)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/30 border-blue-400 shadow-md ring-1 ring-blue-500/50'
                            : 'bg-slate-950/50 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                            <img
                              src={c.imageUrl}
                              alt={c.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{c.name}</h4>
                            <p className="text-[10px] text-slate-300">
                              {c.region} • {c.climate}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-blue-400 block">
                            {formatCurrency(c.averageDailyCost, c.currency)}
                          </span>
                          <span className="text-[10px] text-slate-400">/ day</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 bg-blue-500/15 rounded-2xl border border-blue-400/25 flex items-center justify-between text-xs text-blue-200">
                  <span>Want to visit these places?</span>
                  <Link to="/trips/new" className="font-bold text-white underline flex items-center gap-1">
                    Plan Trip <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Map */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-3">
            <MapView
              trip={currentTrip}
              selectedCityId={selectedCity || undefined}
              onSelectCity={(cityName) => {
                setSelectedCity(cityName);
                const cityObj = mockCities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
                if (cityObj) {
                  setCenterOverride([cityObj.lat, cityObj.lng]);
                }
              }}
              showAllCities={selectedMode === 'all' || !currentTrip}
              centerOverride={centerOverride}
              className="h-[620px] w-full"
            />
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};
