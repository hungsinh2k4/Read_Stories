import type { StoryDetails, ApiResponse } from "../types/story";

export const fetchStoryDetails = async (storySlug: string): Promise<StoryDetails> => {  
    const API_BASE_URL = 'https://otruyenapi.com/v1/api';
    const response = await fetch(`${API_BASE_URL}/truyen-tranh/${storySlug}`);
    if (!response.ok) {
        throw new Error('Failed to fetch story details');
    }
    const apiResponse: ApiResponse<StoryDetails> = await response.json();
    
    if (apiResponse.status !== 'success') {
        throw new Error(apiResponse.message || 'API request failed');
    }
    
    // Transform the data to match our interface
    const storyData = apiResponse.data.item;
    
    return {
        ...storyData,
        thumb_url: `${apiResponse.data.APP_DOMAIN_CDN_IMAGE}/uploads/comics/${storyData.thumb_url}`,
    };
};