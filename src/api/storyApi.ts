import type { StoryDetails, ApiResponse, ChapterData, ChapterContentResponse, SearchApiResponse, GenresApiResponse } from "../types/story";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
export const getChapterList = (storyDetails: StoryDetails, serverIndex: number = 0): ChapterData[] => {
  if (!storyDetails.chapters || storyDetails.chapters.length === 0) {
    return [];
  }

  // Lấy server theo index (mặc định server 0 - server chính)
  const targetServer = storyDetails.chapters[serverIndex] || storyDetails.chapters[0];
  return targetServer?.server_data || [];
};

// Tìm chapter theo filename hoặc chapter_api_data trong danh sách hoặc từ StoryDetails
export const findChapterByFilename = (
  chaptersOrStory: ChapterData[] | StoryDetails,
  identifier: string
): ChapterData | null => {
  // Nếu là array ChapterData[]
  if (Array.isArray(chaptersOrStory)) {
    // Tìm theo filename, chapter_api_data hoặc chapter_name
    return chaptersOrStory.find(chapter =>
      chapter.filename === identifier ||
      chapter.chapter_api_data === identifier ||
      chapter.chapter_name === identifier
    ) || null;
  }

  // Nếu là StoryDetails, tìm trong tất cả servers
  const storyDetails = chaptersOrStory as StoryDetails;
  if (!storyDetails.chapters) return null;

  for (const server of storyDetails.chapters) {
    const found = server.server_data?.find(chapter =>
      chapter.filename === identifier ||
      chapter.chapter_api_data === identifier ||
      chapter.chapter_name === identifier
    );
    if (found) return found;
  }

  return null;
};

// Lấy chapter trước/sau - sử dụng chapter_name vì là unique
export const getAdjacentChapter = (chapters: ChapterData[], currentChapterName: string, direction: 'prev' | 'next'): ChapterData | null => {
  const currentIndex = chapters.findIndex(chapter => chapter.chapter_name === currentChapterName);
  if (currentIndex === -1) return null;

  if (direction === 'prev' && currentIndex > 0) {
    return chapters[currentIndex - 1];
  } else if (direction === 'next' && currentIndex < chapters.length - 1) {
    return chapters[currentIndex + 1];
  }
  return null;
};


export const searchApi = async (query: string): Promise<SearchApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tim-kiem?keyword=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    const apiResponse: SearchApiResponse = await response.json();
    if (apiResponse.status !== 'success') {
      throw new Error(apiResponse.message || 'API request failed');
    }
    return apiResponse;
  } catch (error) {
    console.error('Error fetching search API:', error);
    throw error;
  }
};

export const getAllGenres = async (): Promise<GenresApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/the-loai`);
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    const apiResponse: GenresApiResponse = await response.json();
    if (apiResponse.status !== 'success') {
      throw new Error(apiResponse.message || 'API request failed');
    }
    return apiResponse;
  } catch (error) {
    console.error('Error fetching all genres:', error);
    throw error;
  }
};