import { useQuery } from '@tanstack/react-query';
import {
    fetchStoryDetails,
    fetchChapterContent,
    searchApi,
    getAllGenres,
} from '../api/storyApi';
import type { StoryDetails, SearchApiResponse, GenresApiResponse } from '../types/story';

// Query keys
export const storyKeys = {
    all: ['stories'] as const,
    details: (slug: string) => ['stories', 'details', slug] as const,
    chapter: (chapterApiData: string) => ['stories', 'chapter', chapterApiData] as const,
    search: (query: string) => ['stories', 'search', query] as const,
    genres: ['genres'] as const,
};

// Hook lấy thông tin chi tiết truyện
export const useStoryDetails = (storySlug: string) => {
    return useQuery<StoryDetails, Error>({
        queryKey: storyKeys.details(storySlug),
        queryFn: () => fetchStoryDetails(storySlug),
        enabled: !!storySlug,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
    });
};

// Hook lấy nội dung chapter
export const useChapterContent = (chapterApiData: string) => {
    return useQuery<string[], Error>({
        queryKey: storyKeys.chapter(chapterApiData),
        queryFn: () => fetchChapterContent(chapterApiData),
        enabled: !!chapterApiData,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
    });
};

// Hook tìm kiếm truyện
export const useSearchStories = (query: string) => {
    return useQuery<SearchApiResponse, Error>({
        queryKey: storyKeys.search(query),
        queryFn: () => searchApi(query),
        enabled: !!query && query.length > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook lấy tất cả thể loại
export const useGenres = () => {
    return useQuery<GenresApiResponse, Error>({
        queryKey: storyKeys.genres,
        queryFn: getAllGenres,
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
    });
};
