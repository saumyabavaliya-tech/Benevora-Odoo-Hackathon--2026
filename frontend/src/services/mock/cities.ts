import { City } from '../../types';
import { mockCities } from '../../data/mockData';
import { delay } from '../../lib/utils';

export const cityService = {
  async getAllCities(): Promise<City[]> {
    await delay(150);
    return mockCities;
  },

  async getCityById(id: string): Promise<City | null> {
    await delay(100);
    return mockCities.find((c) => c.id === id) || null;
  },

  async searchCities(query: string, filters?: { region?: string; cost?: string; climate?: string }): Promise<City[]> {
    await delay(200);
    let results = [...mockCities];
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }
    if (filters?.region && filters.region !== 'All') {
      results = results.filter((c) => c.region === filters.region || c.country === filters.region);
    }
    if (filters?.cost && filters.cost !== 'All') {
      results = results.filter((c) => c.costIndex === filters.cost);
    }
    if (filters?.climate && filters.climate !== 'All') {
      results = results.filter((c) => c.climate === filters.climate);
    }
    return results;
  },
};
