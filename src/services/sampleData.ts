import { userDataService } from './userDataService';

// Helper functions để thêm sample data cho testing
export const addSampleData = async (userId: string) => {
  try {
    console.log('Adding sample data for user:', userId);

    // Thêm sample reading progress
    await userDataService.addOrUpdateReadingProgress({
      userId,
      storyId: 'dau-pha-thuong-khung',
      storyName: 'Đấu Phá Thương Khung',
      storySlug: 'dau-pha-thuong-khung',
      storyThumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      progress: 75,
      readChapters: 1200,
      totalChapters: 1600,
      lastRead: new Date(),
      rating: 4.8,
      isFavorite: true,
      category: 'Tiên hiệp'
    });

    await userDataService.addOrUpdateReadingProgress({
      userId,
      storyId: 'ton-than',
      storyName: 'Tôn Thần',
      storySlug: 'ton-than',
      storyThumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      progress: 100,
      readChapters: 2000,
      totalChapters: 2000,
      lastRead: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      rating: 4.9,
      isFavorite: true,
      category: 'Huyền huyễn'
    });

    // Thêm sample favorites
    await userDataService.addToFavorites({
      userId,
      storyId: 'dau-pha-thuong-khung',
      storyName: 'Đấu Phá Thương Khung',
      storySlug: 'dau-pha-thuong-khung',
      storyThumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      addedAt: new Date(),
      category: 'Tiên hiệp',
      status: 'ongoing'
    });

    await userDataService.addToFavorites({
      userId,
      storyId: 'ton-than',
      storyName: 'Tôn Thần',
      storySlug: 'ton-than',
      storyThumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      category: 'Huyền huyễn',
      status: 'completed'
    });

    console.log('✅ Sample data added successfully!');
    return { success: true, message: 'Sample data added successfully!' };
  } catch (error: any) {
    console.error('❌ Error adding sample data:', error);
    return { success: false, error: error.message };
  }
};
