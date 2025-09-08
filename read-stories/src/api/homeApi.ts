import type { HomeApiResponse } from '../types/api';

const API_BASE_URL = 'https://otruyenapi.com/v1/api';

export const homeApi = {
  getHomeData: async (): Promise<HomeApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/home`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  }
};
