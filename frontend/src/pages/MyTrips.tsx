import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Compass, Share2, Copy, Check } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { TripCard } from '../components/trip/TripCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Trip, TripStatus } from '../types';

export const MyTrips: React.FC = () => {
  const { trips, deleteTrip, duplicateTrip } = useTrips();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sharingTrip, setSharingTrip] = useState<Trip | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const tabs: { label: string; value: string }[] = [
    { label: 'All Trips', value: 'All' },
    { label: 'Upcoming', value: 'Upcoming' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Drafts', value: 'Draft' },
  ];

  const filteredTrips = trips.filter((trip) => {
    const matchesTab = activeTab === 'All' || trip.status === activeTab;
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destinations.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleCopyShareLink = () => {
    if (sharingTrip) {
      const shareUrl = `${window.location.origin}/shared/${sharingTrip.shareId || 'gt-share-123'}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <DashboardLayout>
      <PageContainer className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Trip Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              My Planned Journeys
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View, edit, duplicate, and share your multi-city adventures.
            </p>
          </div>

          <Link to="/trips/new">
            <Button
              variant="primary"
              size="md"
              className="bg-blue-600 hover:bg-blue-500 font-bold shadow-md shadow-blue-600/20"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Create New Trip
            </Button>
          </Link>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const count =
                tab.value === 'All'
                  ? trips.length
                  : trips.filter((t) => t.status === tab.value).length;
              const isSelected = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name or city..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Trip Cards Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No journeys match this filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ready to explore? Create your first personalized itinerary with Travel Saarthi AI.
              </p>
            </div>
            <Link to="/trips/new">
              <Button variant="primary" size="sm">
                Create a Journey
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDuplicate={duplicateTrip}
                onDelete={deleteTrip}
                onShare={(t) => setSharingTrip(t)}
              />
            ))}
          </div>
        )}

        {/* Share Trip Modal */}
        {sharingTrip && (
          <Modal
            isOpen={!!sharingTrip}
            onClose={() => setSharingTrip(null)}
            title="Share Your Journey"
            description="Anyone with this link can view this itinerary and clone it into their account."
          >
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Shareable Link</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/shared/${sharingTrip.shareId || 'gt-share-123'}`}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-mono"
                  />
                  <Button
                    onClick={handleCopyShareLink}
                    variant="primary"
                    size="sm"
                    leftIcon={copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="ghost" onClick={() => setSharingTrip(null)}>
                  Done
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};
