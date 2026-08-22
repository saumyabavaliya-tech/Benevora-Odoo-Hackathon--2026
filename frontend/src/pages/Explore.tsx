import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, Plus, Star, Sparkles, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { CityCard } from '../components/city/CityCard';
import { City, CostLevel } from '../types';
import { mockCities, mockActivities } from '../data/mockData';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../lib/utils';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../components/ui/SafeImage';

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCost, setSelectedCost] = useState('All');
  const [selectedCityModal, setSelectedCityModal] = useState<City | null>(null);

  const regions = ['All', 'West India', 'North India', 'South India', 'Desert / Heritage'];
  const costs = ['All', 'Budget', 'Moderate', 'Luxury'];

  const filteredCities = useMemo(() => {
    return mockCities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.region.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === 'All' || city.region.toLowerCase().includes(selectedRegion.toLowerCase());

      const matchesCost = selectedCost === 'All' || city.costIndex === selectedCost;

      return matchesSearch && matchesRegion && matchesCost;
    });
  }, [searchQuery, selectedRegion, selectedCost]);

  const cityActivities = selectedCityModal
    ? mockActivities.filter((a) => a.cityName.toLowerCase() === selectedCityModal.name.toLowerCase())
    : [];

  return (
    <DashboardLayout>
      <PageContainer className="space-y-8">
        {/* Page Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Global Destination Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Explore Places & Cities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover vibrant cultural hubs, coastal havens, and heritage retreats for your next trip.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city name, state, or climate (e.g., Goa, Mumbai, Tropical)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            {/* Region Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 mr-1 uppercase">Region:</span>
              {regions.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedRegion === reg
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Cost Filters */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1 uppercase">Cost:</span>
              {costs.map((cost) => (
                <button
                  key={cost}
                  type="button"
                  onClick={() => setSelectedCost(cost)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCost === cost
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Showing {filteredCities.length} destinations</span>
            <span>Sorted by popularity score</span>
          </div>

          {filteredCities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No destinations found</h3>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCities.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  onViewDetails={(c) => setSelectedCityModal(c)}
                  onAddToTrip={() => navigate('/trips/new')}
                />
              ))}
            </div>
          )}
        </div>

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
              <div className="h-56 rounded-2xl overflow-hidden relative bg-slate-900">
                <SafeImage
                  src={selectedCityModal.imageUrl}
                  alt={selectedCityModal.name}
                  className="w-full h-full object-cover"
                  fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xs text-blue-300 font-bold block">{selectedCityModal.climate}</span>
                  <span className="text-sm font-bold">Best time to visit: {selectedCityModal.bestTimeToVisit}</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedCityModal.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Attractions & Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCityModal.highlights.map((h, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-xl border border-blue-100">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {cityActivities.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Popular Experiences in {selectedCityModal.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cityActivities.map((act) => (
                      <div key={act.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 truncate mr-2">{act.name}</span>
                        <span className="font-black text-blue-600 shrink-0">
                          {formatCurrency(act.estimatedCost, act.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setSelectedCityModal(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedCityModal(null);
                    navigate('/trips/new');
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Create Trip with {selectedCityModal.name}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};
