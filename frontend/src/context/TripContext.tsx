import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, ItineraryItem, Expense, Memory, TripStop } from '../types';
import { tripApi } from '../services/api/trips';
import { memoryApi } from '../services/api/memories';
import { tripService as mockTripService } from '../services/mock/trips';
import { memoryService as mockMemoryService } from '../services/mock/memories';

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  getTrip: (id: string) => Trip | undefined;
  setActiveTripById: (id: string) => Promise<Trip | null>;
  createTrip: (tripData: any) => Promise<Trip>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<boolean>;
  duplicateTrip: (id: string) => Promise<Trip>;
  updateItinerary: (tripId: string, items: ItineraryItem[]) => Promise<Trip>;
  addItineraryItem: (tripId: string, item: Omit<ItineraryItem, 'id'> & { id?: string }) => Promise<Trip>;
  deleteItineraryItem: (tripId: string, itemId: string) => Promise<Trip>;
  addStop: (tripId: string, stopData: { cityId?: string; cityName?: string; arrivalDate: string; departureDate: string; order?: number }) => Promise<Trip>;
  deleteStop: (tripId: string, stopId: string) => Promise<Trip>;
  addExpense: (tripId: string, expense: Omit<Expense, 'id'>) => Promise<Trip>;
  deleteExpense: (tripId: string, expenseId: string) => Promise<Trip>;
  addMemory: (memory: Omit<Memory, 'id' | 'likesCount'>) => Promise<Memory>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let data: Trip[] = [];
      try {
        data = await tripApi.getAllTrips();
      } catch {
        data = await mockTripService.getAllTrips();
      }

      if (data.length === 0) {
        data = await mockTripService.getAllTrips();
      }

      setTrips(data);
      if (!activeTrip && data.length > 0) {
        setActiveTrip(data[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trips');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const setActiveTripById = async (id: string): Promise<Trip | null> => {
    let trip = trips.find((t) => t.id === id);
    if (!trip) {
      try {
        trip = (await tripApi.getTripById(id)) || null;
      } catch {
        trip = (await mockTripService.getTripById(id)) || null;
      }
    }
    if (trip) {
      setActiveTrip(trip);
    }
    return trip || null;
  };

  const createTrip = async (tripData: any): Promise<Trip> => {
    let created: Trip;
    try {
      created = await tripApi.createTrip(tripData);
    } catch {
      created = await mockTripService.createTrip(tripData);
    }
    setTrips((prev) => [created, ...prev]);
    setActiveTrip(created);
    return created;
  };

  const updateTrip = async (id: string, updates: Partial<Trip>): Promise<Trip> => {
    let updated: Trip;
    try {
      updated = await tripApi.updateTrip(id, updates);
    } catch {
      updated = await mockTripService.updateTrip(id, updates);
    }
    setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    if (activeTrip?.id === id) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const deleteTrip = async (id: string): Promise<boolean> => {
    try {
      await tripApi.deleteTrip(id);
    } catch {
      await mockTripService.deleteTrip(id);
    }
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (activeTrip?.id === id) {
      const remaining = trips.filter((t) => t.id !== id);
      setActiveTrip(remaining.length > 0 ? remaining[0] : null);
    }
    return true;
  };

  const duplicateTrip = async (id: string): Promise<Trip> => {
    const duplicated = await mockTripService.duplicateTrip(id);
    setTrips((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  const updateItinerary = async (tripId: string, items: ItineraryItem[]): Promise<Trip> => {
    let updated: Trip;
    try {
      updated = await tripApi.updateItinerary(tripId, items);
    } catch {
      updated = await mockTripService.updateItinerary(tripId, items);
    }
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const addItineraryItem = async (tripId: string, item: Omit<ItineraryItem, 'id'> & { id?: string }): Promise<Trip> => {
    let updated: Trip;
    try {
      updated = await tripApi.addItineraryItem(tripId, item);
    } catch {
      const existing = trips.find((t) => t.id === tripId);
      const newItem: ItineraryItem = {
        ...item,
        id: item.id || `it-${Date.now()}`,
      };
      updated = await mockTripService.updateItinerary(tripId, [...(existing?.itinerary || []), newItem]);
    }
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const deleteItineraryItem = async (tripId: string, itemId: string): Promise<Trip> => {
    let updated: Trip;
    try {
      updated = await tripApi.deleteItineraryItem(tripId, itemId);
    } catch {
      const existing = trips.find((t) => t.id === tripId);
      const filtered = (existing?.itinerary || []).filter((it) => it.id !== itemId);
      updated = await mockTripService.updateItinerary(tripId, filtered);
    }
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const addStop = async (tripId: string, stopData: { cityId?: string; cityName?: string; arrivalDate: string; departureDate: string; order?: number }): Promise<Trip> => {
    let updated: Trip;
    try {
      updated = await tripApi.addStop(tripId, stopData);
    } catch {
      const existing = trips.find((t) => t.id === tripId);
      const newStop: TripStop = {
        id: `stop-${Date.now()}`,
        cityId: stopData.cityId || '1',
        cityName: stopData.cityName || 'Destination',
        country: 'India',
        arrivalDate: stopData.arrivalDate,
        departureDate: stopData.departureDate,
        daysCount: 2,
        order: stopData.order || (existing?.stops.length || 0) + 1,
        lat: 23.0,
        lng: 72.5,
      };
      const updatedStops = [...(existing?.stops || []), newStop];
      updated = await mockTripService.updateTrip(tripId, {
        stops: updatedStops,
        destinations: Array.from(new Set(updatedStops.map((s) => s.cityName))),
      });
    }
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const deleteStop = async (tripId: string, stopId: string): Promise<Trip> => {
    let updated: Trip;
    try {
      updated = await tripApi.deleteStop(tripId, stopId);
    } catch {
      const existing = trips.find((t) => t.id === tripId);
      const updatedStops = (existing?.stops || []).filter((s) => s.id !== stopId);
      updated = await mockTripService.updateTrip(tripId, {
        stops: updatedStops,
        destinations: Array.from(new Set(updatedStops.map((s) => s.cityName))),
      });
    }
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const addExpense = async (tripId: string, expense: Omit<Expense, 'id'>): Promise<Trip> => {
    let updated: Trip;
    try {
      updated = await tripApi.addExpense(tripId, expense);
    } catch {
      updated = await mockTripService.addExpense(tripId, expense);
    }
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const deleteExpense = async (tripId: string, expenseId: string): Promise<Trip> => {
    let updated: Trip;
    try {
      updated = await tripApi.deleteExpense(tripId, expenseId);
    } catch {
      updated = await mockTripService.deleteExpense(tripId, expenseId);
    }
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const addMemory = async (memoryData: Omit<Memory, 'id' | 'likesCount'>): Promise<Memory> => {
    let created: Memory;
    try {
      created = await memoryApi.addMemory(memoryData);
    } catch {
      created = await mockMemoryService.addMemory(memoryData);
    }
    if (memoryData.tripId) {
      const trip = trips.find((t) => t.id === memoryData.tripId);
      if (trip) {
        const updatedMemories = [created, ...(trip.memories || [])];
        await updateTrip(trip.id, { memories: updatedMemories });
      }
    }
    return created;
  };

  const getTrip = (id: string): Trip | undefined => {
    return trips.find((t) => t.id === id);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        isLoading,
        error,
        fetchTrips,
        getTrip,
        setActiveTripById,
        createTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,
        updateItinerary,
        addItineraryItem,
        deleteItineraryItem,
        addStop,
        deleteStop,
        addExpense,
        deleteExpense,
        addMemory,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export const useTrips = useTrip;
