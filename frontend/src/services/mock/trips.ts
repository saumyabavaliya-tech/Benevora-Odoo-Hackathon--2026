import { Trip, ItineraryItem, Expense, TripStop } from '../../types';
import { mockTrips } from '../../data/mockData';
import { delay } from '../../lib/utils';

const STORAGE_KEY = 'globetrotter_trips';

function getStoredTrips(): Trip[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load trips from local storage', e);
  }
  return mockTrips;
}

function saveStoredTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error('Failed to save trips to local storage', e);
  }
}

export const tripService = {
  async getAllTrips(): Promise<Trip[]> {
    await delay(200);
    return getStoredTrips();
  },

  async getTripById(id: string): Promise<Trip | null> {
    await delay(150);
    const trips = getStoredTrips();
    return trips.find((t) => t.id === id) || null;
  },

  async getTripByShareId(shareId: string): Promise<Trip | null> {
    await delay(200);
    const trips = getStoredTrips();
    return trips.find((t) => t.shareId === shareId || t.id === shareId) || null;
  },

  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'expenses' | 'memories' | 'itinerary' | 'stops'> & { stops?: TripStop[]; itinerary?: ItineraryItem[] }): Promise<Trip> {
    await delay(300);
    const trips = getStoredTrips();
    const newId = `trip-${Date.now()}`;
    const newTrip: Trip = {
      ...tripData,
      id: newId,
      stops: tripData.stops || [],
      itinerary: tripData.itinerary || [],
      expenses: [],
      memories: [],
      shareId: `gt-${Date.now().toString(36)}`,
      isPublic: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    trips.unshift(newTrip);
    saveStoredTrips(trips);
    return newTrip;
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    await delay(250);
    const trips = getStoredTrips();
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    trips[index] = {
      ...trips[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    saveStoredTrips(trips);
    return trips[index];
  },

  async deleteTrip(id: string): Promise<boolean> {
    await delay(200);
    let trips = getStoredTrips();
    trips = trips.filter((t) => t.id !== id);
    saveStoredTrips(trips);
    return true;
  },

  async duplicateTrip(id: string): Promise<Trip> {
    await delay(250);
    const trips = getStoredTrips();
    const original = trips.find((t) => t.id === id);
    if (!original) throw new Error('Trip not found');
    const newTrip: Trip = {
      ...original,
      id: `trip-${Date.now()}`,
      name: `${original.name} (Copy)`,
      shareId: `gt-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    trips.unshift(newTrip);
    saveStoredTrips(trips);
    return newTrip;
  },

  async updateItinerary(tripId: string, items: ItineraryItem[]): Promise<Trip> {
    await delay(150);
    const trips = getStoredTrips();
    const index = trips.findIndex((t) => t.id === tripId);
    if (index === -1) throw new Error('Trip not found');
    trips[index].itinerary = items;
    trips[index].updatedAt = new Date().toISOString().split('T')[0];
    saveStoredTrips(trips);
    return trips[index];
  },

  async addExpense(tripId: string, expenseData: Omit<Expense, 'id'>): Promise<Trip> {
    await delay(200);
    const trips = getStoredTrips();
    const index = trips.findIndex((t) => t.id === tripId);
    if (index === -1) throw new Error('Trip not found');
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    trips[index].expenses.push(newExpense);
    trips[index].updatedAt = new Date().toISOString().split('T')[0];
    saveStoredTrips(trips);
    return trips[index];
  },

  async deleteExpense(tripId: string, expenseId: string): Promise<Trip> {
    await delay(150);
    const trips = getStoredTrips();
    const index = trips.findIndex((t) => t.id === tripId);
    if (index === -1) throw new Error('Trip not found');
    trips[index].expenses = trips[index].expenses.filter((e) => e.id !== expenseId);
    trips[index].updatedAt = new Date().toISOString().split('T')[0];
    saveStoredTrips(trips);
    return trips[index];
  },
};
