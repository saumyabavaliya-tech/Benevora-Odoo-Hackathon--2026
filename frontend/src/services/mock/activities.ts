import { Activity } from '../../types';
import { mockActivities } from '../../data/mockData';
import { delay } from '../../lib/utils';

export const activityService = {
  async getAllActivities(): Promise<Activity[]> {
    await delay(150);
    return mockActivities;
  },

  async getActivitiesByCity(cityIdOrName: string): Promise<Activity[]> {
    await delay(150);
    return mockActivities.filter(
      (a) => a.cityId === cityIdOrName || a.cityName.toLowerCase() === cityIdOrName.toLowerCase()
    );
  },

  async searchActivities(query: string, category?: string): Promise<Activity[]> {
    await delay(200);
    let results = [...mockActivities];
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.cityName.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category && category !== 'All') {
      results = results.filter((a) => a.category === category);
    }
    return results;
  },
};
