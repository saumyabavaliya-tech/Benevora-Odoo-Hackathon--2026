import React, { useState } from 'react';
import {
  Plus,
  Camera,
  Play,
  Sparkles,
  Heart,
  Bookmark,
  MapPin,
  Clock,
  Share2,
  Trash2,
  Check,
  Compass,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { MemoryCard } from '../components/memories/MemoryCard';
import { MemoryUpload, MemoryStory } from '../components/memories/MemoryUpload';
import { Button } from '../components/common/Button';
import { Memory, City, Activity } from '../types';
import { mockMemories, mockCities, mockActivities } from '../data/mockData';
import { formatCurrency } from '../lib/utils';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../components/ui/SafeImage';

export const Memories: React.FC = () => {
  const { trips } = useTrips();
  const [activeTab, setActiveTab] = useState<'memories' | 'saved'>('memories');

  // Memories State
  const [memories, setMemories] = useState<Memory[]>(mockMemories);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [filterTrip, setFilterTrip] = useState('All');

  // Saved Items State
  const [savedCities, setSavedCities] = useState<City[]>([mockCities[0], mockCities[1]]);
  const [savedActivities, setSavedActivities] = useState<Activity[]>([mockActivities[0], mockActivities[1]]);
  const [savedFilterType, setSavedFilterType] = useState<'all' | 'places' | 'activities'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleLike = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likesCount: m.likesCount + 1 } : m))
    );
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    showToast('Memory removed from scrapbook');
  };

  const handleUploadMemory = (newMem: Omit<Memory, 'id' | 'likesCount'>) => {
    const created: Memory = {
      ...newMem,
      id: `mem-${Date.now()}`,
      likesCount: 1,
    };
    setMemories([created, ...memories]);
    showToast('New memory added to your collection!');
  };

  const handleRemoveSavedCity = (cityId: string) => {
    setSavedCities((prev) => prev.filter((c) => c.id !== cityId));
    showToast('Destination removed from saved items');
  };

  const handleRemoveSavedActivity = (actId: string) => {
    setSavedActivities((prev) => prev.filter((a) => a.id !== actId));
    showToast('Activity removed from saved items');
  };

  const handleShareItem = (name: string) => {
    navigator.clipboard.writeText(window.location.href);
    showToast(`Link for "${name}" copied to clipboard!`);
  };

  const filteredMemories =
    filterTrip === 'All' ? memories : memories.filter((m) => m.tripId === filterTrip);

  return (
    <DashboardLayout>
      <PageContainer className="space-y-8">
        {/* Toast feedback */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-2 animate-fade-in border border-blue-400/40">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header & Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Personal Travel Collection
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Saved Places & Travel Scrapbook
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Browse your bookmarked destinations, activities, and captured trip memories.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-white/15 shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab('memories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'memories'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Memories ({memories.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'saved'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Items ({savedCities.length + savedActivities.length})</span>
            </button>
          </div>
        </div>

        {/* MEMORIES TAB */}
        {activeTab === 'memories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Filter Trips Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setFilterTrip('All')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    filterTrip === 'All'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-900/80 border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white backdrop-blur-md'
                  }`}
                >
                  All Stories ({memories.length})
                </button>
                {trips.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFilterTrip(t.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      filterTrip === t.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-900/80 border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white backdrop-blur-md'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {memories.length > 0 && (
                  <Button
                    onClick={() => {
                      setSelectedStoryIndex(0);
                      setIsStoryOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    leftIcon={<Play className="w-4 h-4 text-blue-400" />}
                  >
                    Story Mode
                  </Button>
                )}
                <Button
                  onClick={() => setIsUploadOpen(true)}
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="bg-blue-600 hover:bg-blue-500 font-bold shadow-lg shadow-blue-600/30"
                >
                  Add Memory
                </Button>
              </div>
            </div>

            {/* Gallery Grid */}
            {filteredMemories.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/15 p-8 shadow-xl">
                <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">No memories pinned yet</h3>
                <p className="text-xs text-slate-300 mt-1">Upload your favorite snapshots from your trip.</p>
                <Button
                  onClick={() => setIsUploadOpen(true)}
                  variant="primary"
                  size="sm"
                  className="mt-4 bg-blue-600 hover:bg-blue-500 font-bold"
                >
                  Upload First Memory
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMemories.map((mem, index) => (
                  <div key={mem.id} className="relative group">
                    <MemoryCard
                      memory={mem}
                      onLike={handleLike}
                      onClick={() => {
                        setSelectedStoryIndex(index);
                        setIsStoryOpen(true);
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMemory(mem.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors opacity-0 group-hover:opacity-100 z-10 border border-white/10"
                      title="Remove memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SAVED & LIKED ITEMS TAB */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            {/* Filter by Type */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400 mr-1">Filter:</span>
              <button
                type="button"
                onClick={() => setSavedFilterType('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  savedFilterType === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/80 text-slate-300 border border-white/15 hover:bg-slate-800'
                }`}
              >
                All Saved ({savedCities.length + savedActivities.length})
              </button>
              <button
                type="button"
                onClick={() => setSavedFilterType('places')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  savedFilterType === 'places'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/80 text-slate-300 border border-white/15 hover:bg-slate-800'
                }`}
              >
                Saved Places ({savedCities.length})
              </button>
              <button
                type="button"
                onClick={() => setSavedFilterType('activities')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  savedFilterType === 'activities'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/80 text-slate-300 border border-white/15 hover:bg-slate-800'
                }`}
              >
                Saved Activities ({savedActivities.length})
              </button>
            </div>

            {/* Saved Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Places */}
              {(savedFilterType === 'all' || savedFilterType === 'places') &&
                savedCities.map((city) => (
                  <div
                    key={city.id}
                    className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-800">
                      <SafeImage
                        src={city.imageUrl}
                        alt={city.name}
                        className="w-full h-full object-cover"
                        fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600/90 text-[10px] font-bold text-white uppercase tracking-wider">
                        City / Place
                      </span>
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="text-base font-extrabold text-white">{city.name}</h3>
                        <span className="text-xs text-slate-300">{city.country} • {city.region}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{city.description}</p>
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10">
                        <span className="text-blue-300 font-bold">Climate: {city.climate}</span>
                        <span className="text-slate-400">Score: {city.popularityScore}/100</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          onClick={() => handleShareItem(city.name)}
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs"
                          leftIcon={<Share2 className="w-3.5 h-3.5" />}
                        >
                          Share
                        </Button>
                        <Button
                          onClick={() => handleRemoveSavedCity(city.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Activities */}
              {(savedFilterType === 'all' || savedFilterType === 'activities') &&
                savedActivities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-800">
                      <SafeImage
                        src={act.imageUrl}
                        alt={act.title}
                        className="w-full h-full object-cover"
                        fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600/90 text-[10px] font-bold text-white uppercase tracking-wider">
                        {act.category}
                      </span>
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="text-base font-extrabold text-white">{act.title}</h3>
                        <span className="text-xs text-slate-300">{act.cityName}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{act.description}</p>
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {act.duration}
                        </span>
                        <span className="text-sm font-black text-blue-400">
                          {formatCurrency(act.cost, '₹')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          onClick={() => handleShareItem(act.title)}
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs"
                          leftIcon={<Share2 className="w-3.5 h-3.5" />}
                        >
                          Share
                        </Button>
                        <Button
                          onClick={() => handleRemoveSavedActivity(act.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Upload Modal */}
        <MemoryUpload
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          trips={trips}
          onUpload={handleUploadMemory}
        />

        {/* Cinematic Story Mode Modal */}
        <MemoryStory
          isOpen={isStoryOpen}
          onClose={() => setIsStoryOpen(false)}
          memories={filteredMemories}
          initialIndex={selectedStoryIndex}
        />
      </PageContainer>
    </DashboardLayout>
  );
};
