/**
 * Authentication API Service
 */

import { apiClient } from './client';
import { User } from '../../types';

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
}

interface BackendUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export function formatBackendUser(u: BackendUser): User {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
    bio: 'GlobeTrotter Explorer & Journey Curator',
    homeCity: 'Ahmedabad, India',
    passportCountry: 'India',
    preferences: {
      travelStyles: ['Adventure', 'Cultural', 'Photography'],
      favoriteDestinations: ['Goa', 'Udaipur', 'Manali'],
      favoriteActivities: ['Sightseeing', 'Food Trail', 'Sunset Boat Cruise'],
      budgetPreference: 'Moderate',
      currency: 'INR',
      language: 'English, Hindi',
      pace: 'Balanced',
    },
    joinedDate: u.created_at ? u.created_at.split('T')[0] : '2026-08-22',
    tripsCount: 0,
    countriesVisited: 1,
  };
}

export const authApi = {
  async register(name: string, email: string, password: string):Promise<{ token: string; user: User }> {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem('globetrotter_token', res.access_token);
    return {
      token: res.access_token,
      user: formatBackendUser(res.user),
    };
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('globetrotter_token', res.access_token);
    return {
      token: res.access_token,
      user: formatBackendUser(res.user),
    };
  },

  async getMe(): Promise<User> {
    const res = await apiClient<BackendUser>('/auth/me', {
      method: 'GET',
    });
    return formatBackendUser(res);
  },

  async updateProfile(data: { name?: string; email?: string; password?: string }): Promise<User> {
    const res = await apiClient<BackendUser>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return formatBackendUser(res);
  },

  logout(): void {
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
  },
};
