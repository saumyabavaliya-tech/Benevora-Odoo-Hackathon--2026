/**
 * Cities & Activities API Services
 */

import { apiClient } from './client';
import { City, Activity } from '../../types';

interface BackendCity {
  id: number;
  name: string;
  country: string;
  region: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  cost_index: number;
  popularity: number;
  best_time_to_visit: string | null;
  image_url: string | null;
  activities?: BackendActivity[];
}

interface BackendActivity {
  id: number;
  city_id: number;
  name: string;
  description: string | null;
  category: string;
  duration_minutes: number;
  estimated_cost: number;
  currency: string;
  rating: number;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function formatBackendCity(c: BackendCity): City {
  const costMap: Record<number, 'Budget' | 'Moderate' | 'Expensive' | 'Luxury'> = {
    1: 'Budget',
    2: 'Moderate',
    3: 'Expensive',
    4: 'Luxury',
  };

  return {
    id: String(c.id),
    name: c.name,
    country: c.country,
    region: c.region || c.country,
    description: c.description || `${c.name} is a premier destination in ${c.country}.`,
    costIndex: costMap[c.cost_index] || 'Moderate',
    popularityScore: Math.round(c.popularity * 20) || 85,
    climate: 'Tropical',
    bestTimeToVisit: c.best_time_to_visit || 'Oct - Mar',
    imageUrl: c.image_url || 'https://images.unsplash.com/photo-1599831104321-7397b973e20e?w=800',
    galleryImages: [c.image_url || 'https://images.unsplash.com/photo-1599831104321-7397b973e20e?w=800'],
    lat: Number(c.latitude || 23.0),
    lng: Number(c.longitude || 72.5),
    averageDailyCost: c.cost_index * 1500,
    currency: 'INR',
    highlights: ['Cultural Heritage', 'Scenic Spots', 'Local Delights'],
    activitiesCount: c.activities ? c.activities.length : 3,
  };
}

export function formatBackendActivity(a: BackendActivity, cityName?: string): Activity {
  const catCapitalized = (a.category.charAt(0).toUpperCase() + a.category.slice(1).toLowerCase()) as any;

  return {
    id: String(a.id),
    name: a.name,
    description: a.description || `${a.name} experience.`,
    cityId: String(a.city_id),
    cityName: cityName || 'Destination',
    durationHours: Math.round((a.duration_minutes / 60) * 10) / 10 || 2,
    estimatedCost: Number(a.estimated_cost) || 0,
    currency: a.currency || 'INR',
    category: catCapitalized || 'Sightseeing',
    rating: Number(a.rating) || 4.5,
    reviewCount: 120,
    imageUrl: a.image_url || 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800',
    locationName: a.name,
    lat: Number(a.latitude || 23.0),
    lng: Number(a.longitude || 72.5),
    tags: [a.category, 'Popular', 'Recommended'],
  };
}

export const cityApi = {
  async getAllCities(): Promise<City[]> {
    const res = await apiClient<BackendCity[]>('/cities');
    return res.map(formatBackendCity);
  },

  async getCityById(id: string): Promise<City | null> {
    try {
      const res = await apiClient<BackendCity>(`/cities/${id}`);
      return formatBackendCity(res);
    } catch {
      return null;
    }
  },

  async searchCities(query: string, filters?: { region?: string; cost?: string }): Promise<City[]> {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (filters?.region && filters.region !== 'All') params.append('region', filters.region);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient<BackendCity[]>(`/cities/search${queryString}`);
    return res.map(formatBackendCity);
  },
};

export const activityApi = {
  async getAllActivities(): Promise<Activity[]> {
    const res = await apiClient<BackendActivity[]>('/activities');
    return res.map((a) => formatBackendActivity(a));
  },

  async getActivitiesByCity(cityId: string): Promise<Activity[]> {
    const res = await apiClient<BackendActivity[]>(`/activities?city_id=${cityId}`);
    return res.map((a) => formatBackendActivity(a));
  },

  async searchActivities(query: string, category?: string): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (category && category !== 'All') params.append('category', category.toLowerCase());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient<BackendActivity[]>(`/activities/search${queryString}`);
    return res.map((a) => formatBackendActivity(a));
  },
};
