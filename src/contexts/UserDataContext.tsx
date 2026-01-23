import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { userDataService, type ReadingProgress, type FavoriteStory } from "../services/userDataService";
import { useAuthContext } from "./AuthContext";
import type { Story } from "../types/api";

// Interface for stories with progress info
export interface StoryWithProgress extends Story {
    progress: number;
    readChapters: number;
    totalChapters: number;
    lastRead: Date;
    rating: number;
    isFavorite: boolean;
}

interface UserDataContextProps {
    readingHistory: ReadingProgress[];
    favoriteStories: FavoriteStory[];
    loading: boolean;
    error: string | null;
    addReadingProgress: (
        storyId: string,
        storyName: string,
        storySlug: string,
        storyThumbnail: string,
        progress: number,
        readChapters: number,
        totalChapters: number,
        category: string,
        rating?: number
    ) => Promise<void>;
    addToFavorites: (
        storyId: string,
        storyName: string,
        storySlug: string,
        storyThumbnail: string,
        category: string,
        status: string
    ) => Promise<void>;
    removeFromFavorites: (storyId: string) => Promise<void>;
    isStoryFavorite: (storyId: string) => boolean;
    getStoryProgress: (storyId: string) => ReadingProgress | null;
    getStoriesWithProgress: () => StoryWithProgress[];
    getFavoriteStoriesWithProgress: () => StoryWithProgress[];
    refreshUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextProps>({
    readingHistory: [],
    favoriteStories: [],
    loading: true,
    error: null,
    addReadingProgress: async () => { },
    addToFavorites: async () => { },
    removeFromFavorites: async () => { },
    isStoryFavorite: () => false,
    getStoryProgress: () => null,
    getStoriesWithProgress: () => [],
    getFavoriteStoriesWithProgress: () => [],
    refreshUserData: async () => { },
});

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthContext();
    const userId = user?.uid || null;

    const [readingHistory, setReadingHistory] = useState<ReadingProgress[]>([]);
    const [favoriteStories, setFavoriteStories] = useState<FavoriteStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user data - only when userId changes
    useEffect(() => {
        if (!userId) {
            setReadingHistory([]);
            setFavoriteStories([]);
            setLoading(false);
            return;
        }

        const loadUserData = async () => {
            try {
                setLoading(true);

                const [history, favorites] = await Promise.all([
                    userDataService.getReadingHistory(userId),
                    userDataService.getFavoriteStories(userId)
                ]);

                setReadingHistory(history);
                setFavoriteStories(favorites);
                setError(null);
            } catch (err) {
                console.error('Error loading user data:', err);
                setError(err instanceof Error ? err.message : 'Đã có lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [userId]);

    // Refresh user data
    const refreshUserData = useCallback(async () => {
        if (!userId) return;

        try {
            const [history, favorites] = await Promise.all([
                userDataService.getReadingHistory(userId),
                userDataService.getFavoriteStories(userId)
            ]);

            setReadingHistory(history);
            setFavoriteStories(favorites);
            setError(null);
        } catch (err) {
            console.error('Error refreshing user data:', err);
            setError(err instanceof Error ? err.message : 'Đã có lỗi khi tải dữ liệu');
        }
    }, [userId]);

    // Add reading progress
    const addReadingProgress = useCallback(async (
        storyId: string,
        storyName: string,
        storySlug: string,
        storyThumbnail: string,
        progress: number,
        readChapters: number,
        totalChapters: number,
        category: string,
        rating?: number
    ) => {
        if (!userId) return;

        try {
            await userDataService.addOrUpdateReadingProgress({
                userId,
                storyId,
                storyName,
                storySlug,
                storyThumbnail,
                progress,
                readChapters,
                totalChapters,
                lastRead: new Date(),
                rating,
                isFavorite: favoriteStories.some(fav => fav.storyId === storyId),
                category
            });

            // Refresh reading history
            const updatedHistory = await userDataService.getReadingHistory(userId);
            setReadingHistory(updatedHistory);
        } catch (err) {
            console.error('Error adding reading progress:', err);
            setError(err instanceof Error ? err.message : 'Đã có lỗi khi cập nhật tiến độ đọc');
        }
    }, [userId, favoriteStories]);

    // Add to favorites
    const addToFavorites = useCallback(async (
        storyId: string,
        storyName: string,
        storySlug: string,
        storyThumbnail: string,
        category: string,
        status: string
    ) => {
        if (!userId) return;

        try {
            await userDataService.addToFavorites({
                userId,
                storyId,
                storyName,
                storySlug,
                storyThumbnail,
                addedAt: new Date(),
                category,
                status
            });

            // Refresh favorites
            const updatedFavorites = await userDataService.getFavoriteStories(userId);
            setFavoriteStories(updatedFavorites);
        } catch (err) {
            console.error('Error adding to favorites:', err);
            setError(err instanceof Error ? err.message : 'Đã có lỗi khi thêm vào yêu thích');
        }
    }, [userId]);

    // Remove from favorites
    const removeFromFavorites = useCallback(async (storyId: string) => {
        if (!userId) return;

        try {
            await userDataService.removeFromFavorites(userId, storyId);

            // Refresh favorites
            const updatedFavorites = await userDataService.getFavoriteStories(userId);
            setFavoriteStories(updatedFavorites);
        } catch (err) {
            console.error('Error removing from favorites:', err);
            setError(err instanceof Error ? err.message : 'Đã có lỗi khi xóa khỏi yêu thích');
        }
    }, [userId]);

    // Check if story is favorite
    const isStoryFavorite = useCallback((storyId: string): boolean => {
        return favoriteStories.some(fav => fav.storyId === storyId);
    }, [favoriteStories]);

    // Get story progress
    const getStoryProgress = useCallback((storyId: string): ReadingProgress | null => {
        return readingHistory.find(item => item.storyId === storyId) || null;
    }, [readingHistory]);

    // Convert reading history to StoryWithProgress format
    const getStoriesWithProgress = useCallback((): StoryWithProgress[] => {
        return readingHistory.map(item => ({
            _id: item.storyId,
            name: item.storyName,
            slug: item.storySlug,
            origin_name: [item.storyName],
            status: 'ongoing',
            thumb_url: item.storyThumbnail,
            sub_docquyen: false,
            category: [{ id: '1', name: item.category, slug: item.category.toLowerCase() }],
            updatedAt: new Date().toISOString(),
            chaptersLatest: [],
            progress: item.progress,
            readChapters: item.readChapters,
            totalChapters: item.totalChapters,
            lastRead: item.lastRead,
            rating: item.rating || 0,
            isFavorite: favoriteStories.some(fav => fav.storyId === item.storyId)
        }));
    }, [readingHistory, favoriteStories]);

    // Convert favorites to StoryWithProgress format
    const getFavoriteStoriesWithProgress = useCallback((): StoryWithProgress[] => {
        return favoriteStories.map(item => {
            const progress = readingHistory.find(h => h.storyId === item.storyId);
            return {
                _id: item.storyId,
                name: item.storyName,
                slug: item.storySlug,
                origin_name: [item.storyName],
                status: item.status,
                thumb_url: item.storyThumbnail,
                sub_docquyen: false,
                category: [{ id: '1', name: item.category, slug: item.category.toLowerCase() }],
                updatedAt: new Date().toISOString(),
                chaptersLatest: [],
                progress: progress?.progress || 0,
                readChapters: progress?.readChapters || 0,
                totalChapters: progress?.totalChapters || 100,
                lastRead: progress?.lastRead || item.addedAt,
                rating: progress?.rating || 0,
                isFavorite: true
            };
        });
    }, [favoriteStories, readingHistory]);

    return (
        <UserDataContext.Provider value={{
            readingHistory,
            favoriteStories,
            loading,
            error,
            addReadingProgress,
            addToFavorites,
            removeFromFavorites,
            isStoryFavorite,
            getStoryProgress,
            getStoriesWithProgress,
            getFavoriteStoriesWithProgress,
            refreshUserData
        }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserDataContext = () => useContext(UserDataContext);
