/**
 * Memories API Service
 */

import { apiClient } from './client';
import { Memory } from '../../types';

interface BackendMemory {
  id: number;
  user_id: number;
  trip_id: number | null;
  image_url: string;
  caption: string | null;
  location: string | null;
  memory_date: string | null;
  created_at: string;
}

export function formatBackendMemory(m: BackendMemory): Memory {
  return {
    id: String(m.id),
    tripId: m.trip_id ? String(m.trip_id) : '',
    tripName: 'GlobeTrotter Adventure',
    cityName: m.location || 'India',
    country: 'India',
    date: m.memory_date || m.created_at.split('T')[0],
    caption: m.caption || '',
    imageUrl: m.image_url,
    tags: ['Travel', 'Explore'],
    likesCount: 1,
  };
}

export const memoryApi = {
  async getAllMemories(tripId?: string): Promise<Memory[]> {
    const query = tripId ? `?trip_id=${tripId}` : '';
    const res = await apiClient<BackendMemory[]>(`/memories${query}`);
    return res.map(formatBackendMemory);
  },

  async getMemoryById(id: string): Promise<Memory | null> {
    try {
      const res = await apiClient<BackendMemory>(`/memories/${id}`);
      return formatBackendMemory(res);
    } catch {
      return null;
    }
  },

  async addMemory(memoryData: Omit<Memory, 'id' | 'likesCount'>): Promise<Memory> {
    const payload = {
      image_url: memoryData.imageUrl,
      caption: memoryData.caption,
      location: memoryData.cityName,
      memory_date: memoryData.date || new Date().toISOString().split('T')[0],
      trip_id: memoryData.tripId && !isNaN(Number(memoryData.tripId)) ? Number(memoryData.tripId) : null,
    };

    const res = await apiClient<BackendMemory>('/memories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return formatBackendMemory(res);
  },

  async deleteMemory(id: string): Promise<boolean> {
    await apiClient(`/memories/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  async toggleLike(id: string): Promise<Memory> {
    const existing = await memoryApi.getMemoryById(id);
    if (!existing) throw new Error('Memory not found');
    return {
      ...existing,
      likesCount: (existing.likesCount || 0) + 1,
    };
  },
};
