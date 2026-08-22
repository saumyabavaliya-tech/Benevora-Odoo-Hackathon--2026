import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Filter,
  Plus,
  Star,
  Sparkles,
  TrendingUp,
  Compass,
  Clock,
  Check,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { CityCard } from '../components/city/CityCard';
import { City, Activity, ItineraryItem } from '../types';
import { mockCities, mockActivities } from '../data/mockData';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useTrips } from '../context/TripContext';
import { formatCurrency } from '../lib/utils';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../components/ui/SafeImage';

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { trips, updateTrip } = useTrips();

  const [activeCatalogTab, setActiveCatalogTab] = useState<'cities' | 'activities'>('cities');

  // Search & Filter State (Cities)
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCost, setSelectedCost] = useState('All');
  const [selectedCityModal, setSelectedCityModal] = useState<City | null>(null);

  // Search & Filter State (Activities)
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [selectedActivityCategory, setSelectedActivityCategory] = useState('All');
  const [selectedActivityCost, setSelectedActivityCost] = useState('All');
  const [selectedActivityModal, setSelectedActivityModal] = useState<Activity | null>(null);

  // Add to Trip Modal
  const [addToTripTarget, setAddToTripTarget] = useState<{ type: 'city' | 'activity'; item: any } | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [assignedDay, setAssignedDay] = useState<number>(1);
  const [addSuccessMessage, setAddSuccessMessage] = useState<string | null>(null);

  const regions = ['All', 'West India', 'North India', 'South India', 'Desert / Heritage'];
  const costs = ['All', 'Budget', 'Moderate', 'Luxury'];
  const activityCategories = ['All', 'Sightseeing', 'Adventure', 'Food', 'Culture', 'Leisure'];

  const filteredCities = useMemo(() => {
    return mockCities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
        city.region.toLowerCase().includes(citySearchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === 'All' || city.region.toLowerCase().includes(selectedRegion.toLowerCase());

      const matchesCost = selectedCost === 'All' || city.costIndex === selectedCost;

      return matchesSearch && matchesRegion && matchesCost;
    });
  }, [citySearchQuery, selectedRegion, selectedCost]);

  const filteredActivities = useMemo(() => {
    return mockActivities.filter((act) => {
      const matchesSearch =
        act.name.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
        act.cityName.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(activitySearchQuery.toLowerCase());

      const matchesCategory =
        selectedActivityCategory === 'All' ||
        act.category.toLowerCase() === selectedActivityCategory.toLowerCase();

      const matchesCost =
        selectedActivityCost === 'All' ||
        (selectedActivityCost === 'Budget' && act.estimatedCost <= 1000) ||
        (selectedActivityCost === 'Moderate' && act.estimatedCost > 1000 && act.estimatedCost <= 3000) ||
        (selectedActivityCost === 'Luxury' && act.estimatedCost > 3000);

      return matchesSearch && matchesCategory && matchesCost;
    });
  }, [activitySearchQuery, selectedActivityCategory, selectedActivityCost]);

  const handleConfirmAddToTrip = () => {
    if (!selectedTripId || !addToTripTarget) return;

    const targetTrip = trips.find((t) => t.id === selectedTripId);
    if (!targetTrip) return;

    if (addToTripTarget.type === 'city') {
      const city: City = addToTripTarget.item;
      const newStop = {
        id: `stop-${Date.now()}`,
        cityId: city.id,
        cityName: city.name,
        country: city.country,
        arrivalDate: targetTrip.startDate,
        departureDate: targetTrip.endDate,
        daysCount: 2,
        order: targetTrip.stops.length + 1,
        lat: city.lat,
        lng: city.lng,
        coverImage: city.imageUrl,
      };

      const updatedDestinations = targetTrip.destinations.includes(city.name)
        ? targetTrip.destinations
        : [...targetTrip.destinations, city.name];

      updateTrip(targetTrip.id, {
        stops: [...targetTrip.stops, newStop],
        destinations: updatedDestinations,
      });

      setAddSuccessMessage(`Added ${city.name} to "${targetTrip.name}"!`);
    } else {
      const act: Activity = addToTripTarget.item;
      const newItem: ItineraryItem = {
        id: `it-${Date.now()}`,
        dayNumber: Number(assignedDay) || 1,
        date: targetTrip.startDate,
        time: '11:00 AM',
        title: act.name,
        type: 'activity',
        locationName: act.cityName,
        cityName: act.cityName,
        estimatedCost: act.estimatedCost,
        currency: targetTrip.currency,
        completed: false,
        notes: act.description,
      };

      updateTrip(targetTrip.id, {
        itinerary: [...targetTrip.itinerary, newItem],
      });

      setAddSuccessMessage(`Added "${act.name}" to Day ${assignedDay} of "${targetTrip.name}"!`);
    }

    setTimeout(() => {
      setAddSuccessMessage(null);
      setAddToTripTarget(null);
    }, 1800);
  };

  return (
    <DashboardLayout>
      <PageContainer className="space-y-8">
        {/* Header with Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Global Discovery & Experience Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Explore Destinations & Activities
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Search top cities, discover curated adventures, and add them directly into your travel plans.
            </p>
          </div>

          {/* Catalog Tab Toggle */}
          <div className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-white/15 shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveCatalogTab('cities')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCatalogTab === 'cities'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Cities ({mockCities.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCatalogTab('activities')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCatalogTab === 'activities'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Activities ({mockActivities.length})</span>
            </button>
          </div>
        </div>

        {/* CITIES TAB CONTENT */}
        {activeCatalogTab === 'cities' && (
          <div className="space-y-6">
            {/* City Filters */}
            <div className="bg-slate-900/70 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-white/15 shadow-xl space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Search by city name, state, or climate (e.g., Goa, Mumbai, Desert)..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/70 border border-white/15 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-bold text-slate-300 mr-1 uppercase">Region:</span>
                  {regions.map((reg) => (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedRegion === reg
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white border border-white/10'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-300 mr-1 uppercase">Cost:</span>
                  {costs.map((cost) => (
                    <button
                      key={cost}
                      type="button"
                      onClick={() => setSelectedCost(cost)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCost === cost
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white border border-white/10'
                      }`}
                    >
                      {cost}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cities Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span>Showing {filteredCities.length} destinations</span>
                <span>Sorted by popularity score</span>
              </div>

              {filteredCities.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/15 p-8 shadow-xl">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">No destinations found</h3>
                  <p className="text-xs text-slate-300 mt-1">Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCities.map((city) => (
                    <CityCard
                      key={city.id}
                      city={city}
                      onViewDetails={(c) => setSelectedCityModal(c)}
                      onAddToTrip={() => {
                        setAddToTripTarget({ type: 'city', item: city });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVITIES TAB CONTENT */}
        {activeCatalogTab === 'activities' && (
          <div className="space-y-6">
            {/* Activity Filters */}
            <div className="bg-slate-900/70 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-white/15 shadow-xl space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  placeholder="Search activities by title, location, or tag (e.g., Scuba, Safari, Sunset, Food)..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/70 border border-white/15 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-bold text-slate-300 mr-1 uppercase">Category:</span>
                  {activityCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedActivityCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedActivityCategory === cat
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white border border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-300 mr-1 uppercase">Budget:</span>
                  {costs.map((cost) => (
                    <button
                      key={cost}
                      type="button"
                      onClick={() => setSelectedActivityCost(cost)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedActivityCost === cost
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white border border-white/10'
                      }`}
                    >
                      {cost}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activities Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span>Showing {filteredActivities.length} curated experiences</span>
                <span>Includes tours, dining & excursions</span>
              </div>

              {filteredActivities.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/15 p-8 shadow-xl">
                  <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">No experiences found</h3>
                  <p className="text-xs text-slate-300 mt-1">Try broadening your search keywords or categories.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActivities.map((act) => (
                    <div
                      key={act.id}
                      className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-xl overflow-hidden flex flex-col justify-between hover:border-blue-400/40 transition-all group"
                    >
                      <div className="relative h-44 overflow-hidden bg-slate-800">
                        <SafeImage
                          src={act.imageUrl}
                          alt={act.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                          {act.category}
                        </span>
                        <div className="absolute bottom-3 left-3 text-white">
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            {act.cityName}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="text-base font-extrabold text-white line-clamp-1">{act.title}</h3>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{act.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {act.duration}
                          </span>
                          <span className="text-sm font-black text-blue-400">
                            {formatCurrency(act.cost, '₹')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            onClick={() => setSelectedActivityModal(act)}
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-xs"
                          >
                            Details
                          </Button>
                          <Button
                            onClick={() => setAddToTripTarget({ type: 'activity', item: act })}
                            variant="primary"
                            size="sm"
                            className="flex-1 text-xs font-bold"
                            leftIcon={<Plus className="w-3.5 h-3.5" />}
                          >
                            Add to Trip
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* City Detail Modal */}
        {selectedCityModal && (
          <Modal
            isOpen={!!selectedCityModal}
            onClose={() => setSelectedCityModal(null)}
            title={selectedCityModal.name}
            description={`${selectedCityModal.country} • ${selectedCityModal.region}`}
            maxWidth="2xl"
          >
            <div className="space-y-5">
              <div className="h-56 rounded-2xl overflow-hidden relative bg-slate-900 border border-white/10">
                <SafeImage
                  src={selectedCityModal.imageUrl}
                  alt={selectedCityModal.name}
                  className="w-full h-full object-cover"
                  fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xs text-blue-300 font-bold block">{selectedCityModal.climate}</span>
                  <span className="text-sm font-bold text-white">Best time to visit: {selectedCityModal.bestTimeToVisit}</span>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedCityModal.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Key Attractions & Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCityModal.highlights.map((h, i) => (
                    <span key={i} className="text-xs bg-blue-500/20 text-blue-300 font-semibold px-3 py-1 rounded-xl border border-blue-400/30">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button variant="ghost" onClick={() => setSelectedCityModal(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const city = selectedCityModal;
                    setSelectedCityModal(null);
                    setAddToTripTarget({ type: 'city', item: city });
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add {selectedCityModal.name} to Trip
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Activity Detail Modal */}
        {selectedActivityModal && (
          <Modal
            isOpen={!!selectedActivityModal}
            onClose={() => setSelectedActivityModal(null)}
            title={selectedActivityModal.title}
            description={`${selectedActivityModal.cityName} • ${selectedActivityModal.category}`}
            maxWidth="xl"
          >
            <div className="space-y-4">
              <div className="h-48 rounded-2xl overflow-hidden relative bg-slate-900 border border-white/10">
                <SafeImage
                  src={selectedActivityModal.imageUrl}
                  alt={selectedActivityModal.title}
                  className="w-full h-full object-cover"
                  fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedActivityModal.description}
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/70 rounded-2xl border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold">Estimated Cost</span>
                  <span className="text-sm font-black text-blue-400">
                    {formatCurrency(selectedActivityModal.cost, '₹')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Approx Duration</span>
                  <span className="text-sm font-black text-white">
                    {selectedActivityModal.duration}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button variant="ghost" onClick={() => setSelectedActivityModal(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const act = selectedActivityModal;
                    setSelectedActivityModal(null);
                    setAddToTripTarget({ type: 'activity', item: act });
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add to Itinerary
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add to Trip Selection Modal */}
        {addToTripTarget && (
          <Modal
            isOpen={!!addToTripTarget}
            onClose={() => {
              if (!addSuccessMessage) setAddToTripTarget(null);
            }}
            title={
              addToTripTarget.type === 'city'
                ? `Add ${addToTripTarget.item.name} to a Trip`
                : `Add Activity to Trip`
            }
            description="Choose which planned itinerary to insert this into."
          >
            {addSuccessMessage ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/30">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">{addSuccessMessage}</h4>
                <p className="text-xs text-slate-300">Your itinerary has been automatically updated.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                    Select Target Trip
                  </label>
                  {trips.length === 0 ? (
                    <p className="text-xs text-rose-300">No active trips found. Please create one first.</p>
                  ) : (
                    <select
                      value={selectedTripId}
                      onChange={(e) => setSelectedTripId(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {trips.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.totalDays} Days)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {addToTripTarget.type === 'activity' && (
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                      Select Day Number (1 to {trips.find((t) => t.id === selectedTripId)?.totalDays || 5})
                    </label>
                    <select
                      value={assignedDay}
                      onChange={(e) => setAssignedDay(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({
                        length: trips.find((t) => t.id === selectedTripId)?.totalDays || 5,
                      }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Day {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAddToTripTarget(null);
                      navigate('/trips/new');
                    }}
                  >
                    Or Plan Brand New Trip
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setAddToTripTarget(null)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleConfirmAddToTrip}
                      disabled={trips.length === 0}
                    >
                      Confirm Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};
