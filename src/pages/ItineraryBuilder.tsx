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
  Building2,
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
import { ItineraryItem, ItineraryType, TripStop } from '../types';
import { mockCities } from '../data/mockData';
import { formatCurrency } from '../lib/utils';

export const ItineraryBuilder: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { getTrip, updateTrip } = useTrips();
  const trip = getTrip(tripId || '');

  const [viewMode, setViewMode] = useState<'days' | 'timeline' | 'calendar'>('days');

  // Add/Edit Activity Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Add Stop Modal
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState(mockCities[0]?.id || '');
  const [stopDaysCount, setStopDaysCount] = useState<number>(2);

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
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = trip.itinerary.findIndex((item) => item.id === active.id);
    const newIndex = trip.itinerary.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItinerary = arrayMove(trip.itinerary, oldIndex, newIndex);
      updateTrip(trip.id, { itinerary: newItinerary });
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
    setCityName(targetStop?.cityName || trip.destinations[0] || 'Goa');
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

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItemId) {
      // Update
      const updated = trip.itinerary.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              title,
              type,
              time,
              locationName: locationName || cityName,
              cityName,
              estimatedCost,
              notes,
            }
          : item
      );
      updateTrip(trip.id, { itinerary: updated });
    } else {
      // Create new
      const newItem: ItineraryItem = {
        id: `it-${Date.now()}`,
        dayNumber: selectedDayNumber,
        date: trip.startDate,
        time,
        title,
        type,
        locationName: locationName || cityName,
        cityName,
        estimatedCost,
        currency: trip.currency,
        completed: false,
        notes,
      };
      updateTrip(trip.id, { itinerary: [...trip.itinerary, newItem] });
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = trip.itinerary.filter((item) => item.id !== id);
    updateTrip(trip.id, { itinerary: updated });
  };

  const handleToggleComplete = (id: string) => {
    const updated = trip.itinerary.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateTrip(trip.id, { itinerary: updated });
  };

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    const city = mockCities.find((c) => c.id === selectedCityId) || mockCities[0];
    if (!city) return;

    const newStop: TripStop = {
      id: `stop-${Date.now()}`,
      cityId: city.id,
      cityName: city.name,
      country: city.country,
      arrivalDate: trip.startDate,
      departureDate: trip.endDate,
      daysCount: Number(stopDaysCount) || 2,
      order: trip.stops.length + 1,
      lat: city.lat,
      lng: city.lng,
      coverImage: city.imageUrl,
    };

    const updatedDestinations = trip.destinations.includes(city.name)
      ? trip.destinations
      : [...trip.destinations, city.name];

    const updatedTotalDays = trip.totalDays + (Number(stopDaysCount) || 1);

    updateTrip(trip.id, {
      stops: [...trip.stops, newStop],
      destinations: updatedDestinations,
      totalDays: updatedTotalDays,
    });

    setIsAddStopModalOpen(false);
  };

  return (
    <DashboardLayout tripId={trip.id}>
      <PageContainer className="space-y-6">
        {/* Top Header & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <Link to={`/trips/${trip.id}`} className="hover:underline">
                {trip.name}
              </Link>
              <span>/</span>
              <span>Itinerary Builder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Interactive Itinerary Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Drag & drop activities, fine-tune timing, and schedule your stops across {trip.totalDays} days.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-white/15 shadow-md">
              <button
                type="button"
                onClick={() => setViewMode('days')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'days'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
            </div>

            <Button
              onClick={() => setIsAddStopModalOpen(true)}
              variant="outline"
              size="sm"
              leftIcon={<Building2 className="w-4 h-4 text-blue-400" />}
            >
              Add Stop
            </Button>

            <Button
              onClick={() => handleOpenAddModal(1)}
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-500 font-bold"
            >
              Add Activity
            </Button>
          </div>
        </div>

        {/* View Layout 1: Day by Day with Dnd-Kit */}
        {viewMode === 'days' && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-6">
              {Array.from({ length: trip.totalDays }).map((_, index) => {
                const dayNum = index + 1;
                const dayItems = trip.itinerary.filter((i) => i.dayNumber === dayNum);
                const assignedStop =
                  trip.stops[Math.min(index, trip.stops.length - 1)] || trip.stops[0];

                return (
                  <ItineraryDay
                    key={dayNum}
                    dayNumber={dayNum}
                    dateStr={trip.startDate}
                    cityName={assignedStop?.cityName || trip.destinations[0] || 'Destination'}
                    items={dayItems}
                    currency={trip.currency}
                    onAddItem={handleOpenAddModal}
                    onDeleteItem={handleDeleteItem}
                    onEditItem={handleOpenEditModal}
                    onToggleComplete={handleToggleComplete}
                  />
                );
              })}
            </div>
          </DndContext>
        )}

        {/* View Layout 2: Vertical Visual Timeline */}
        {viewMode === 'timeline' && (
          <div className="bg-slate-900/70 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-xl">
            <ItineraryTimeline items={trip.itinerary} currency={trip.currency} />
          </div>
        )}

        {/* View Layout 3: Calendar View */}
        {viewMode === 'calendar' && (
          <ItineraryCalendar
            items={trip.itinerary}
            startDateStr={trip.startDate}
            currency={trip.currency}
          />
        )}

        {/* Add Stop Modal */}
        <Modal
          isOpen={isAddStopModalOpen}
          onClose={() => setIsAddStopModalOpen(false)}
          title="Add Destination Stop"
          description="Include another city or stop in your travel route."
        >
          <form onSubmit={handleAddStop} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Select Destination
              </label>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mockCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.country} ({city.region})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Days to spend at this stop
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={stopDaysCount}
                onChange={(e) => setStopDaysCount(Number(e.target.value))}
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsAddStopModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Stop to Itinerary
              </Button>
            </div>
          </form>
        </Modal>

        {/* Add/Edit Activity Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItemId ? 'Edit Activity' : `Add Activity to Day ${selectedDayNumber}`}
          description="Schedule a stop, meal, tour, or transit in your trip."
        >
          <form onSubmit={handleSaveActivity} className="space-y-4">
            <Input
              label="Activity Title"
              placeholder="e.g. Scuba Diving at Grand Island, Sunset Dinner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ItineraryType)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="activity">Activity / Tour</option>
                  <option value="meal">Dining / Meal</option>
                  <option value="travel">Travel / Transit</option>
                  <option value="accommodation">Hotel / Stay</option>
                  <option value="leisure">Leisure / Free time</option>
                </select>
              </div>

              <Input
                label="Time"
                placeholder="10:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Location / Place"
                placeholder="e.g. Mandovi River Pier"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
              <Input
                label="City"
                placeholder="e.g. Goa"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
              />
            </div>

            <Input
              label={`Estimated Cost (${trip.currency})`}
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Number(e.target.value))}
            />

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Pre-booked via operator, bring swimwear"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingItemId ? 'Update Activity' : 'Add to Day'}
              </Button>
            </div>
          </form>
        </Modal>
      </PageContainer>
    </DashboardLayout>
  );
};
