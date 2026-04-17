import { categories, events, foodBooths, locations } from '../data/mockData.js';

export const mockFestivalRepository = {
  async getBootstrapData() {
    return {
      events,
      locations,
      categories,
      foodBooths,
    };
  },

  async getEvents() {
    return events;
  },

  async getLocations() {
    return locations;
  },

  async getCategories() {
    return categories;
  },

  async getFoodBooths() {
    return foodBooths;
  },
};
