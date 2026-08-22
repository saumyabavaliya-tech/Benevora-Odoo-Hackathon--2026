import { Memory } from '../../types';
import { mockTrips } from '../../data/mockData';
import { delay } from '../../lib/utils';

const STORAGE_KEY = 'globetrotter_memories';

function getStoredMemories(): Memory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load memories', e);
  }
  const initialMemories = mockTrips.flatMap((t) => t.memories);
  return initialMemories;
}

function saveStoredMemories(memories: Memory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (e) {
    console.error('Failed to save memories', e);
  }
}

export const memoryService = {
  async getAllMemories(): Promise<Memory[]> {
    await delay(150);
    return getStoredMemories();
  },

  async getMemoryById(id: string): Promise<Memory | null> {
    await delay(100);
    const memories = getStoredMemories();
    return memories.find((m) => m.id === id) || null;
  },

  async addMemory(memoryData: Omit<Memory, 'id' | 'likesCount'>): Promise<Memory> {
    await delay(300);
    const memories = getStoredMemories();
    const newMemory: Memory = {
      ...memoryData,
      id: `mem-${Date.now()}`,
      likesCount: 1,
    };
    memories.unshift(newMemory);
    saveStoredMemories(memories);
    return newMemory;
  },

  async toggleLike(id: string): Promise<Memory> {
    await delay(100);
    const memories = getStoredMemories();
    const index = memories.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Memory not found');
    memories[index].likesCount += 1;
    saveStoredMemories(memories);
    return memories[index];
  },
};
