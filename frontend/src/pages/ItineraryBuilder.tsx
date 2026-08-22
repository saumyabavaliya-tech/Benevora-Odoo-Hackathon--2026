import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
} from '@dnd-kit/sortable';
import {
  ListTodo,
  Calendar as CalendarIcon,
  GitCommit,
  Plus,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  PieChart,
  Utensils,
  Camera,
  Car,
  Hotel,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { ItineraryDay } from '../components/itinerary/ItineraryDay';
import { ItineraryTimeline } from '../components/itinerary/ItineraryTimeline';
import { ItineraryCalendar } from '../components/itinerary/ItineraryCalendar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { ItineraryItem, ItineraryType } from '../types';
import { formatCurrency } from '../lib/utils';

export const ItineraryBuilder: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { getTrip, updateTrip, addItineraryItem, deleteItineraryItem, updateItinerary } = useTrips();
  const trip = getTrip(tripId || '');

  const [viewMode, setViewMode] = useState<'days' | 'timeline' | 'calendar'>('days');

  // Add/Edit Activity Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ItineraryType>('activity');
  const [time, setTime] = useState('10:00 AM');
  const [locationName, setLocationName] = useState('');
  const [cityName, setCityName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(500);
  const [notes, setNotes] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  if (!trip) {
    return (
      <DashboardLayout>
        <PageContainer className="text-center py-20">
          <h2 className="text-lg font-bold text-slate-800">Trip not found</h2>
          <Link to="/trips" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Back to My Trips</Button>
          </Link>
        </PageContainer>
      </DashboardLayout>
    );
  }

  // Handle Drag & Drop reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = trip.itinerary.findIndex((item) => item.id === active.id);
    const newIndex = trip.itinerary.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItinerary = arrayMove(trip.itinerary, oldIndex, newIndex);
      await updateItinerary(trip.id, newItinerary);
    }
  };

  const handleOpenAddModal = (dayNum: number) => {
    setSelectedDayNumber(dayNum);
    setEditingItemId(null);
    setTitle('');
    setType('activity');
    setTime('10:00 AM');
    setLocationName('');
    const targetStop = trip.stops[Math.min(dayNum - 1, trip.stops.length - 1)];
    setCityName(targetStop?.cityName || trip.destinations[0] || 'Destination');
    setEstimatedCost(500);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ItineraryItem) => {
    setEditingItemId(item.id);
    setSelectedDayNumber(item.dayNumber);
    setTitle(item.title);
    setType(item.type);
    setTime(item.time);
    setLocationName(item.locationName);
    setCityName(item.cityName);
    setEstimatedCost(item.estimatedCost);
    setNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startDateObj = new Date(trip.startDate);
    const dayOffsetMs = (selectedDayNumber - 1) * 24 * 60 * 60 * 1000;
    const computedDate = new Date(startDateObj.getTime() + dayOffsetMs).toISOString().split('T')[0];

    if (editingItemId) {
      const updatedList = trip.itinerary.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              title,
              type,
              time,
              date: computedDate,
              dayNumber: selectedDayNumber,
              locationName: locationName || cityName,
              cityName: cityName || trip.destinations[0] || 'Destination',
              estimatedCost: Number(estimatedCost) || 0,
              notes,
            }
          : item
      );
      await updateItinerary(trip.id, updatedList);
    } else {
      const newItem: Omit<ItineraryItem, 'id'> & { id?: string } = {
        id: `it-${Date.now()}`,
        dayNumber: selectedDayNumber,
        date: computedDate,
        time,
        title,
        type,
        locationName: locationName || cityName,
        cityName: cityName || trip.destinations[0] || 'Destination',
        estimatedCost: Number(estimatedCost) || 0,
        currency: trip.currency,
        completed: false,
        notes,
      };
      await addItineraryItem(trip.id, newItem);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItineraryItem(trip.id, id);
  };

  const handleToggleComplete = async (id: string) => {
    const updated = trip.itinerary.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    await updateItinerary(trip.id, updated);
  };

  return (
    <DashboardLayout tripId={trip.id}>
      <PageContainer className="space-y-6">
        {/* Top Header & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Link to={`/trips/${trip.id}`} className="hover:underline">
                {trip.name}
              </Link>
              <span>/</span>
              <span>Itinerary Builder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Interactive Itinerary Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Drag & drop activities, meals, transport, and schedule your stops across {trip.totalDays} days.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('days')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'days'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Day by Day</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => handleOpenAddModal(1)}
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* Dynamic View Modes */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {viewMode === 'days' && (
            <div className="space-y-6">
              {Array.from({ length: trip.totalDays }).map((_, index) => {
                const dayNum = index + 1;
                const itemsForDay = trip.itinerary.filter((item) => item.dayNumber === dayNum);
                const startDateObj = new Date(trip.startDate);
                const dayDate = new Date(startDateObj.getTime() + index * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0];

                const targetStop = trip.stops[Math.min(index, trip.stops.length - 1)];

                return (
                  <ItineraryDay
                    key={dayNum}
                    dayNumber={dayNum}
                    date={dayDate}
                    cityName={targetStop?.cityName || trip.destinations[0] || 'Destination'}
                    items={itemsForDay}
                    currency={trip.currency}
                    onAddItem={() => handleOpenAddModal(dayNum)}
                    onEditItem={handleOpenEditModal}
                    onDeleteItem={handleDeleteItem}
                    onToggleComplete={handleToggleComplete}
                  />
                );
              })}
            </div>
          )}

          {viewMode === 'timeline' && (
            <ItineraryTimeline
              trip={trip}
              onEditItem={handleOpenEditModal}
              onDeleteItem={handleDeleteItem}
              onToggleComplete={handleToggleComplete}
            />
          )}

          {viewMode === 'calendar' && (
            <ItineraryCalendar
              trip={trip}
              onAddItem={handleOpenAddModal}
              onEditItem={handleOpenEditModal}
            />
          )}
        </DndContext>

        {/* Add / Edit Activity & Meal Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItemId ? 'Edit Itinerary Item' : `Add Item to Day ${selectedDayNumber}`}
          description="Schedule activities, meals, tours, or transport."
        >
          <form onSubmit={handleSaveActivity} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Item Title / Name</label>
              <Input
                placeholder="e.g. Seafood Dinner at Fisherman's Wharf or Adalaj Stepwell"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Type / Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ItineraryType)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="activity">🎯 Activity / Sightseeing</option>
                  <option value="meal">🍽️ Dining / Meal</option>
                  <option value="travel">🚆 Travel / Transit</option>
                  <option value="accommodation">🏨 Hotel / Stay</option>
                  <option value="leisure">☕ Leisure / Free time</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Time</label>
                <Input
                  placeholder="e.g. 10:00 AM or 13:30"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Location / Venue</label>
                <Input
                  placeholder="e.g. Fisherman's Wharf, Candolim"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
                <Input
                  placeholder="e.g. Goa"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Cost ({trip.currency})</label>
              <Input
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Notes & Tips</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Famous for prawn balchao, sunset views"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingItemId ? 'Update Item' : 'Add to Day'}
              </Button>
            </div>
          </form>
        </Modal>
      </PageContainer>
    </DashboardLayout>
  );
};
