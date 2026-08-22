import React, { useState } from 'react';
import { Plus, Camera, Play, Sparkles, Heart } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { MemoryCard } from '../components/memories/MemoryCard';
import { MemoryUpload, MemoryStory } from '../components/memories/MemoryUpload';
import { Button } from '../components/common/Button';
import { Memory } from '../types';
import { mockMemories } from '../data/mockData';

export const Memories: React.FC = () => {
  const { trips } = useTrips();
  const [memories, setMemories] = useState<Memory[]>(mockMemories);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [filterTrip, setFilterTrip] = useState('All');

  const handleLike = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likesCount: m.likesCount + 1 } : m))
    );
  };

  const handleUploadMemory = (newMem: Omit<Memory, 'id' | 'likesCount'>) => {
    const created: Memory = {
      ...newMem,
      id: `mem-${Date.now()}`,
      likesCount: 1,
    };
    setMemories([created, ...memories]);
  };

  const filteredMemories = filterTrip === 'All'
    ? memories
    : memories.filter((m) => m.tripId === filterTrip);

  return (
    <DashboardLayout>
      <PageContainer className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Travel Scrapbook
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Journey Memories & Stories
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Preserve photographs, journal notes, and captured moments across your travels.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {memories.length > 0 && (
              <Button
                onClick={() => {
                  setSelectedStoryIndex(0);
                  setIsStoryOpen(true);
                }}
                variant="outline"
                size="md"
                leftIcon={<Play className="w-4 h-4 text-blue-600" />}
              >
                Story Mode
              </Button>
            )}
            <Button
              onClick={() => setIsUploadOpen(true)}
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-500 font-bold"
            >
              Add Memory
            </Button>
          </div>
        </div>

        {/* Filter Trips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterTrip('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterTrip === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No memories pinned yet</h3>
            <p className="text-xs text-slate-400 mt-1">Upload your favorite snapshots from your trip.</p>
            <Button
              onClick={() => setIsUploadOpen(true)}
              variant="primary"
              size="sm"
              className="mt-4"
            >
              Upload First Memory
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((mem, index) => (
              <MemoryCard
                key={mem.id}
                memory={mem}
                onLike={handleLike}
                onClick={() => {
                  setSelectedStoryIndex(index);
                  setIsStoryOpen(true);
                }}
              />
            ))}
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
