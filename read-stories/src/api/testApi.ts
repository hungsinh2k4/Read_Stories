import { fetchStoryDetails, fetchChapterContent } from './storyApi';
export const testStoryAPI = async () => {
  try {
    console.log('Testing story API...');
    const storySlug = 'quyen-ru-co-ay';
    const storyDetails = await fetchStoryDetails(storySlug);
    
    console.log('Story Details:', storyDetails);
    
    // Lấy chapter đầu tiên để test
    if (storyDetails.chapters && storyDetails.chapters.length > 0) {
      const firstServer = storyDetails.chapters[0];
      if (firstServer.server_data && firstServer.server_data.length > 0) {
        const firstChapter = firstServer.server_data[0];
        
        console.log('Testing first chapter:', firstChapter);
        
        if (firstChapter.chapter_api_data) {
          const chapterContent = await fetchChapterContent(firstChapter.chapter_api_data);
          console.log('Chapter content (first 5 images):', chapterContent.slice(0, 5));
        }
      }
    }
  } catch (error) {
    console.error('API Test failed:', error);
  }
};

// Export để có thể call từ console
(window as any).testStoryAPI = testStoryAPI;
