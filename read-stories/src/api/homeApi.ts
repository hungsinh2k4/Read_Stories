import type { Category, HomeApiResponse, CategoryApiResponse } from '../types/api';

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

export const categoryApi = {
  getMangaData: async (page: number, categorySlug?: string): Promise<CategoryApiResponse> => {
    try {
      let url = `${API_BASE_URL}/the-loai/${categorySlug}?page=${page}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching manga data:', error);
      throw error;
    }
}
};

export const newStoriesApi = {
  getNewStories: async (page: number): Promise<CategoryApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/danh-sach/truyen-moi?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    }
    catch (error) {
      console.error('Error fetching new stories:', error);
      throw error;
    }
  }
};

export const completedStoriesApi = {
  getCompletedStories: async (page: number): Promise<CategoryApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/danh-sach/hoan-thanh?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching completed stories:', error);
      throw error;
    }   
  }
};
