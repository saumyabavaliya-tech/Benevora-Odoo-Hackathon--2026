/**
 * Trips, Itinerary & Expenses API Services
 */

import { apiClient } from './client';
import { Trip, TripStop, ItineraryItem, Expense, Memory, TripStatus } from '../../types';

interface BackendTripStop {
  id: number;
  trip_id: number;
  city_id: number;
  arrival_date: string;
  departure_date: string;
  stop_order: number;
  city?: {
    id: number;
    name: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    image_url: string | null;
  };
}

interface BackendItineraryItem {
  id: number;
  trip_id: number;
  activity_id: number | null;
  trip_stop_id: number | null;
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  item_type: string;
  item_order: number;
  estimated_cost: number;
  activity?: {
    id: number;
    name: string;
    image_url: string | null;
  };
}

interface BackendExpense {
  id: number;
  trip_id: number;
  category: string;
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
}

interface BackendMemory {
  id: number;
  user_id: number;
  trip_id: number | null;
  image_url: string;
  caption: string | null;
  location: string | null;
  memory_date: string | null;
}

interface BackendTripDetail {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  status: string;
  cover_image: string | null;
  share_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  trip_stops?: BackendTripStop[];
  itinerary_items?: BackendItineraryItem[];
  expenses?: BackendExpense[];
  memories?: BackendMemory[];
}

const CITY_NAME_TO_ID: Record<string, number> = {
  ahmedabad: 1,
  mumbai: 2,
  goa: 3,
  udaipur: 4,
  jaipur: 5,
  manali: 6,
  varanasi: 7,
  kochi: 8,
  rishikesh: 9,
  bengaluru: 10,
  bangalore: 10,
  agra: 11,
  amritsar: 12,
};

export function resolveCityId(cityIdOrName: string | number): number {
  if (typeof cityIdOrName === 'number' && cityIdOrName > 0) {
    return cityIdOrName;
  }
  const str = String(cityIdOrName).toLowerCase().trim();
  const num = parseInt(str, 10);
  if (!isNaN(num) && num > 0) {
    return num;
  }
  for (const [name, id] of Object.entries(CITY_NAME_TO_ID)) {
    if (str.includes(name)) {
      return id;
    }
  }
  return 1;
}

export function parseTimeString(timeStr?: string | null): string {
  if (!timeStr || !timeStr.trim()) return '09:00:00';
  const clean = timeStr.trim();
  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const meridian = match12[3] ? match12[3].toUpperCase() : null;
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  }
  if (clean.length === 5 && clean.includes(':')) {
    return `${clean}:00`;
  }
  if (clean.length === 8 && clean.split(':').length === 3) {
    return clean;
  }
  return '09:00:00';
}

export function mapItemType(typeStr?: string): string {
  const t = (typeStr || 'activity').toLowerCase().trim();
  if (t === 'meal' || t === 'food') return 'meal';
  if (t === 'travel' || t === 'transit') return 'travel';
  if (t === 'accommodation' || t === 'hotel' || t === 'stay') return 'hotel';
  if (t === 'activity' || t === 'sightseeing') return 'activity';
  return 'other';
}

export function formatBackendTrip(t: BackendTripDetail): Trip {
  const stops: TripStop[] = (t.trip_stops || []).map((s) => ({
    id: String(s.id),
    cityId: String(s.city_id),
    cityName: s.city?.name || 'Destination',
    country: s.city?.country || 'India',
    arrivalDate: s.arrival_date,
    departureDate: s.departure_date,
    daysCount: Math.max(1, Math.round((new Date(s.departure_date).getTime() - new Date(s.arrival_date).getTime()) / (1000 * 60 * 60 * 24)) + 1),
    order: s.stop_order,
    lat: Number(s.city?.latitude || 23.0),
    lng: Number(s.city?.longitude || 72.5),
    coverImage: s.city?.image_url || 'https://images.unsplash.com/photo-1599831104321-7397b973e20e?w=800',
  }));

  const destinations = stops.map((s) => s.cityName);

  const itinerary: ItineraryItem[] = (t.itinerary_items || []).map((item) => ({
    id: String(item.id),
    dayNumber: Math.max(1, Math.round((new Date(item.date).getTime() - new Date(t.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1),
    date: item.date,
    time: item.start_time ? item.start_time.slice(0, 5) : '09:00',
    endTime: item.end_time ? item.end_time.slice(0, 5) : undefined,
    title: item.title,
    type: (item.item_type as any) || 'activity',
    cityName: destinations[0] || 'Destination',
    locationName: item.title,
    notes: item.description || undefined,
    estimatedCost: Number(item.estimated_cost) || 0,
    currency: t.currency || 'INR',
    activityId: item.activity_id ? String(item.activity_id) : undefined,
    imageUrl: item.activity?.image_url || undefined,
  }));

  const expenses: Expense[] = (t.expenses || []).map((e) => ({
    id: String(e.id),
    tripId: String(e.trip_id),
    title: e.description,
    category: (e.category.charAt(0).toUpperCase() + e.category.slice(1).toLowerCase()) as any,
    amount: Number(e.amount),
    currency: e.currency || 'INR',
    date: e.expense_date,
  }));

  const memories: Memory[] = (t.memories || []).map((m) => ({
    id: String(m.id),
    tripId: String(t.id),
    tripName: t.name,
    cityName: m.location || destinations[0] || 'India',
    country: 'India',
    date: m.memory_date || t.start_date,
    caption: m.caption || '',
    imageUrl: m.image_url,
    tags: ['Travel', 'Explore'],
    likesCount: 1,
  }));

  const statusCapitalized = (t.status.charAt(0).toUpperCase() + t.status.slice(1).toLowerCase()) as TripStatus;
  const totalDays = Math.max(1, Math.round((new Date(t.end_date).getTime() - new Date(t.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return {
    id: String(t.id),
    name: t.name,
    description: t.description || '',
    coverImage: t.cover_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200',
    startDate: t.start_date,
    endDate: t.end_date,
    totalDays,
    destinations: destinations.length > 0 ? destinations : ['Destination'],
    stops,
    travelStyles: ['Adventure', 'Culture'],
    totalBudget: Number(t.budget) || 0,
    currency: t.currency || 'INR',
    status: statusCapitalized || 'Upcoming',
    accommodationPreference: 'Boutique Heritage',
    transportPreference: 'Express Train / Flight',
    isPublic: t.is_public,
    shareId: t.share_id || undefined,
    itinerary,
    expenses,
    memories,
    createdAt: t.created_at ? t.created_at.split('T')[0] : '2026-08-22',
    updatedAt: t.updated_at ? t.updated_at.split('T')[0] : '2026-08-22',
  };
}

export const tripApi = {
  async getAllTrips(): Promise<Trip[]> {
    const res = await apiClient<BackendTripDetail[]>('/trips');
    const fullTrips = await Promise.all(
      res.map(async (t) => {
        try {
          const detail = await apiClient<BackendTripDetail>(`/trips/${t.id}`);
          return formatBackendTrip(detail);
        } catch {
          return formatBackendTrip(t);
        }
      })
    );
    return fullTrips;
  },

  async getTripById(id: string): Promise<Trip | null> {
    try {
      const res = await apiClient<BackendTripDetail>(`/trips/${id}`);
      return formatBackendTrip(res);
    } catch {
      return null;
    }
  },

  async getTripByShareId(shareId: string): Promise<Trip | null> {
    try {
      const res = await apiClient<any>(`/shared/${shareId}`);
      return formatBackendTrip(res);
    } catch {
      return null;
    }
  },

  async createTrip(tripData: any): Promise<Trip> {
    const backendPayload = {
      name: tripData.name || 'My Adventure',
      description: tripData.description || '',
      start_date: tripData.startDate || new Date().toISOString().split('T')[0],
      end_date: tripData.endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      budget: Number(tripData.totalBudget) || 0,
      currency: tripData.currency || 'INR',
      status: (tripData.status || 'upcoming').toLowerCase(),
      cover_image: tripData.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200',
    };

    const createdTrip = await apiClient<BackendTripDetail>('/trips', {
      method: 'POST',
      body: JSON.stringify(backendPayload),
    });

    // Add stops if provided
    if (tripData.stops && tripData.stops.length > 0) {
      for (const stop of tripData.stops) {
        try {
          const cityId = resolveCityId(stop.cityId || stop.cityName);
          await apiClient(`/trips/${createdTrip.id}/stops`, {
            method: 'POST',
            body: JSON.stringify({
              city_id: cityId,
              arrival_date: stop.arrivalDate || createdTrip.start_date,
              departure_date: stop.departureDate || createdTrip.end_date,
              stop_order: stop.order || 1,
            }),
          });
        } catch (e) {
          console.warn('Failed to add stop to backend:', e);
        }
      }
    }

    // Add itinerary items if provided
    if (tripData.itinerary && tripData.itinerary.length > 0) {
      for (const item of tripData.itinerary) {
        try {
          await apiClient(`/trips/${createdTrip.id}/itinerary`, {
            method: 'POST',
            body: JSON.stringify({
              title: item.title,
              description: item.notes || null,
              date: item.date || createdTrip.start_date,
              start_time: parseTimeString(item.time),
              end_time: item.endTime ? parseTimeString(item.endTime) : null,
              item_type: mapItemType(item.type),
              item_order: item.dayNumber || 1,
              estimated_cost: Number(item.estimatedCost) || 0,
            }),
          });
        } catch (e) {
          console.warn('Failed to add itinerary item:', e);
        }
      }
    }

    // Retrieve fresh full trip details from backend
    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${createdTrip.id}`);
    return formatBackendTrip(fullDetail);
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    const payload: any = {};
    if (updates.name) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.startDate) payload.start_date = updates.startDate;
    if (updates.endDate) payload.end_date = updates.endDate;
    if (updates.totalBudget !== undefined) payload.budget = updates.totalBudget;
    if (updates.currency) payload.currency = updates.currency;
    if (updates.status) payload.status = updates.status.toLowerCase();
    if (updates.coverImage) payload.cover_image = updates.coverImage;

    if (Object.keys(payload).length > 0) {
      await apiClient<BackendTripDetail>(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    }

    // If itinerary items are updated, sync them
    if (updates.itinerary) {
      for (const item of updates.itinerary) {
        if (item.id && !item.id.startsWith('it-')) {
          try {
            await apiClient(`/itinerary/${item.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                title: item.title,
                description: item.notes || null,
                date: item.date,
                start_time: parseTimeString(item.time),
                end_time: item.endTime ? parseTimeString(item.endTime) : null,
                item_type: mapItemType(item.type),
                estimated_cost: Number(item.estimatedCost) || 0,
              }),
            });
          } catch (e) {
            console.warn('Failed to update itinerary item:', e);
          }
        } else {
          try {
            await apiClient(`/trips/${id}/itinerary`, {
              method: 'POST',
              body: JSON.stringify({
                title: item.title,
                description: item.notes || null,
                date: item.date,
                start_time: parseTimeString(item.time),
                end_time: item.endTime ? parseTimeString(item.endTime) : null,
                item_type: mapItemType(item.type),
                item_order: item.dayNumber || 1,
                estimated_cost: Number(item.estimatedCost) || 0,
              }),
            });
          } catch (e) {
            console.warn('Failed to create itinerary item:', e);
          }
        }
      }
    }

    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${id}`);
    return formatBackendTrip(fullDetail);
  },

  async deleteTrip(id: string): Promise<boolean> {
    await apiClient(`/trips/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  async shareTrip(id: string): Promise<{ shareId: string; shareUrl: string }> {
    const res = await apiClient<any>(`/trips/${id}/share`, {
      method: 'POST',
    });
    return {
      shareId: res.share_id,
      shareUrl: res.share_url,
    };
  },

  async addItineraryItem(tripId: string, item: Omit<ItineraryItem, 'id'> & { id?: string }): Promise<Trip> {
    const payload = {
      title: item.title,
      description: item.notes || null,
      date: item.date,
      start_time: parseTimeString(item.time),
      end_time: item.endTime ? parseTimeString(item.endTime) : null,
      item_type: mapItemType(item.type),
      item_order: item.dayNumber || 1,
      estimated_cost: Number(item.estimatedCost) || 0,
    };

    await apiClient(`/trips/${tripId}/itinerary`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${tripId}`);
    return formatBackendTrip(fullDetail);
  },

  async deleteItineraryItem(tripId: string, itemId: string): Promise<Trip> {
    if (itemId && !itemId.startsWith('it-')) {
      await apiClient(`/itinerary/${itemId}`, {
        method: 'DELETE',
      });
    }
    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${tripId}`);
    return formatBackendTrip(fullDetail);
  },

  async updateItinerary(tripId: string, items: ItineraryItem[]): Promise<Trip> {
    for (const item of items) {
      if (item.id && !item.id.startsWith('it-')) {
        try {
          await apiClient(`/itinerary/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              title: item.title,
              description: item.notes || null,
              date: item.date,
              start_time: parseTimeString(item.time),
              end_time: item.endTime ? parseTimeString(item.endTime) : null,
              item_type: mapItemType(item.type),
              estimated_cost: Number(item.estimatedCost) || 0,
            }),
          });
        } catch (e) {
          console.warn('Failed to update itinerary item:', e);
        }
      } else {
        try {
          await apiClient(`/trips/${tripId}/itinerary`, {
            method: 'POST',
            body: JSON.stringify({
              title: item.title,
              description: item.notes || null,
              date: item.date,
              start_time: parseTimeString(item.time),
              end_time: item.endTime ? parseTimeString(item.endTime) : null,
              item_type: mapItemType(item.type),
              item_order: item.dayNumber || 1,
              estimated_cost: Number(item.estimatedCost) || 0,
            }),
          });
        } catch (e) {
          console.warn('Failed to create itinerary item:', e);
        }
      }
    }

    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${tripId}`);
    return formatBackendTrip(fullDetail);
  },

  async addStop(tripId: string, stopData: { cityId?: string; cityName?: string; arrivalDate: string; departureDate: string; order?: number }): Promise<Trip> {
    const cityId = resolveCityId(stopData.cityId || stopData.cityName || '1');
    await apiClient(`/trips/${tripId}/stops`, {
      method: 'POST',
      body: JSON.stringify({
        city_id: cityId,
        arrival_date: stopData.arrivalDate,
        departure_date: stopData.departureDate,
        stop_order: stopData.order || 1,
      }),
    });

    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${tripId}`);
    return formatBackendTrip(fullDetail);
  },

  async deleteStop(tripId: string, stopId: string): Promise<Trip> {
    if (stopId && !stopId.startsWith('stop-')) {
      await apiClient(`/stops/${stopId}`, {
        method: 'DELETE',
      });
    }
    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${tripId}`);
    return formatBackendTrip(fullDetail);
  },

  async addExpense(tripId: string, expenseData: Omit<Expense, 'id'>): Promise<Trip> {
    const cat = (expenseData.category || 'other').toLowerCase();
    const validCats = ['transportation', 'accommodation', 'food', 'activities', 'shopping', 'other'];
    const safeCategory = validCats.includes(cat) ? cat : 'other';

    await apiClient(`/trips/${tripId}/expenses`, {
      method: 'POST',
      body: JSON.stringify({
        category: safeCategory,
        description: expenseData.title,
        amount: Number(expenseData.amount) || 0,
        currency: expenseData.currency || 'INR',
        expense_date: expenseData.date || new Date().toISOString().split('T')[0],
      }),
    });

    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${tripId}`);
    return formatBackendTrip(fullDetail);
  },

  async deleteExpense(tripId: string, expenseId: string): Promise<Trip> {
    if (expenseId && !expenseId.startsWith('exp-')) {
      await apiClient(`/expenses/${expenseId}`, {
        method: 'DELETE',
      });
    }

    const fullDetail = await apiClient<BackendTripDetail>(`/trips/${tripId}`);
    return formatBackendTrip(fullDetail);
  },
};
