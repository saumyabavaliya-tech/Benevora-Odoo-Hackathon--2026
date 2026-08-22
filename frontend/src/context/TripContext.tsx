import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, ItineraryItem, Expense, Memory } from '../types';
import { tripService } from '../services/mock/trips';
import { memoryService } from '../services/mock/memories';

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
      const data = await tripService.getAllTrips();
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
      trip = (await tripService.getTripById(id)) || null;
    }
    if (trip) {
      setActiveTrip(trip);
    }
    return trip;
  };

  const createTrip = async (tripData: any): Promise<Trip> => {
    const created = await tripService.createTrip(tripData);
    setTrips((prev) => [created, ...prev]);
    setActiveTrip(created);
    return created;
  };

  const updateTrip = async (id: string, updates: Partial<Trip>): Promise<Trip> => {
    const updated = await tripService.updateTrip(id, updates);
    setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    if (activeTrip?.id === id) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const deleteTrip = async (id: string): Promise<boolean> => {
    await tripService.deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (activeTrip?.id === id) {
      const remaining = trips.filter((t) => t.id !== id);
      setActiveTrip(remaining.length > 0 ? remaining[0] : null);
    }
    return true;
  };

  const duplicateTrip = async (id: string): Promise<Trip> => {
    const duplicated = await tripService.duplicateTrip(id);
    setTrips((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  const updateItinerary = async (tripId: string, items: ItineraryItem[]): Promise<Trip> => {
    const updated = await tripService.updateItinerary(tripId, items);
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const addExpense = async (tripId: string, expense: Omit<Expense, 'id'>): Promise<Trip> => {
    const updated = await tripService.addExpense(tripId, expense);
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const deleteExpense = async (tripId: string, expenseId: string): Promise<Trip> => {
    const updated = await tripService.deleteExpense(tripId, expenseId);
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const addMemory = async (memoryData: Omit<Memory, 'id' | 'likesCount'>): Promise<Memory> => {
    const created = await memoryService.addMemory(memoryData);
    if (memoryData.tripId) {
      const trip = trips.find((t) => t.id === memoryData.tripId);
      if (trip) {
        const updatedMemories = [created, ...trip.memories];
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
