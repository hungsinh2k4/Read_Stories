import type { StoryDetails, ApiResponse, ChapterData } from "../types/story";

const API_BASE_URL = 'https://otruyenapi.com/v1/api';

// Interface cho response của chapter content API
interface ChapterContentResponse {
  status: string;
  message: string;
  data: {
    domain_cdn: string;
    item: {
      _id: string;
      comic_name: string;
      chapter_name: string;
      chapter_title: string;
      chapter_path: string;
      chapter_image: {
        image_page: number;
        image_file: string;
      }[];
    };
  };
}

// Lấy thông tin chi tiết truyện từ slug
export const fetchStoryDetails = async (storySlug: string): Promise<StoryDetails> => {
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

// Lấy danh sách ảnh của chapter từ chapter_api_data
export const fetchChapterContent = async (chapterApiData: string): Promise<string[]> => {
    const response = await fetch(chapterApiData);
    if (!response.ok) {
        throw new Error('Failed to fetch chapter content');
    }
    
    const apiResponse: ChapterContentResponse = await response.json();
    if (apiResponse.status !== 'success') {
        throw new Error(apiResponse.message || 'API request failed');
    }

    // Tạo danh sách URL đầy đủ cho các ảnh
    const imageUrls = apiResponse.data.item.chapter_image.map(img => 
        `${apiResponse.data.domain_cdn}/${apiResponse.data.item.chapter_path}/${img.image_file}`
    );

    return imageUrls;
};

// Lấy danh sách chapter từ story details
export const getChapterList = (storyDetails: StoryDetails): ChapterData[] => {
    if (!storyDetails.chapters || storyDetails.chapters.length === 0) {
        return [];
    }
    
    // Lấy server đầu tiên (thường là server chính)
    const mainServer = storyDetails.chapters[0];
    return mainServer.server_data || [];
};

// Tìm chapter theo filename
export const findChapterByFilename = (chapters: ChapterData[], filename: string): ChapterData | null => {
    return chapters.find(chapter => chapter.filename === filename) || null;
};

// Lấy chapter trước/sau
export const getAdjacentChapter = (chapters: ChapterData[], currentFilename: string, direction: 'prev' | 'next'): ChapterData | null => {
    const currentIndex = chapters.findIndex(chapter => chapter.filename === currentFilename);
    if (currentIndex === -1) return null;
    
    if (direction === 'prev' && currentIndex > 0) {
        return chapters[currentIndex - 1];
    } else if (direction === 'next' && currentIndex < chapters.length - 1) {
        return chapters[currentIndex + 1];
    }
    
    return null;
};