import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Heart, 
  Share2, 
  Calendar, 
  User, 
  Tag,
  ChevronRight,
  Bookmark,
  ArrowLeft
} from 'lucide-react';
import { fetchStoryDetails } from '../api/storyApi';
import type { StoryDetails } from '../types/story';

const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<StoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeChapterServer, setActiveChapterServer] = useState(0);

  useEffect(() => {
    const loadStoryDetails = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const storyData = await fetchStoryDetails(slug);
        setStory(storyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };
    scrollTo(0, 0);

    loadStoryDetails();
  }, [slug]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement API call to add/remove from favorites
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement API call to add/remove bookmark
  };

  const handleShare = async () => {
    if (navigator.share && story) {
      try {
        await navigator.share({
          title: story.name,
          text: `Đọc truyện ${story.name} tại Read Stories`,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Đã copy link truyện vào clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã copy link truyện vào clipboard!');
    }
  };

  const handleReadChapter = (chapterData: any) => {
    // TODO: Navigate to chapter reader
    console.log('Reading chapter:', chapterData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải thông tin truyện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">!</span>
          </div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-lg">Không tìm thấy truyện</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with back button */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Story Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Story Cover */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img 
                  src={story.thumb_url} 
                  alt={story.name}
                  className="w-64 h-80 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    story.status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {story.status === 'completed' ? 'Hoàn thành' : 'Đang cập nhật'}
                  </span>
                </div>
              </div>
            </div>

            {/* Story Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{story.name}</h1>
                {story.origin_name && story.origin_name.length > 0 && (
                  <p className="text-gray-400 text-lg">{story.origin_name.join(', ')}</p>
                )}
              </div>

              {/* Story Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {story.author && story.author.length > 0 && story.author[0] && (
                  <div className="flex items-center gap-3">
                    <User className="text-purple-400" size={20} />
                    <span className="text-gray-300">
                      Tác giả: <span className="text-white">{story.author.join(', ')}</span>
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-400" size={20} />
                  <span className="text-gray-300">
                    Cập nhật: <span className="text-white">{new Date(story.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="text-green-400" size={20} />
                  <span className="text-gray-300">
                    Thể loại: 
                    <span className="ml-2">
                      {story.category.map((cat, index) => (
                        <span key={cat.id} className="text-white">
                          {cat.name}{index < story.category.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="text-orange-400" size={20} />
                  <span className="text-gray-300">
                    Số chương: <span className="text-white">
                      {story.chapters && story.chapters[0] ? story.chapters[0].server_data.length : 0}
                    </span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                  }`}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? 'Đã thích' : 'Yêu thích'}
                </button>

                <button
                  onClick={handleToggleBookmark}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isBookmarked 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                  }`}
                >
                  <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                  {isBookmarked ? 'Đã lưu' : 'Lưu truyện'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200"
                >
                  <Share2 size={20} />
                  Chia sẻ
                </button>
              </div>

              {/* Quick Start Reading */}
              {story.chapters && story.chapters[0] && story.chapters[0].server_data.length > 0 && (
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Bắt đầu đọc</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReadChapter(story.chapters[0].server_data[0])}
                      className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Đọc từ đầu
                    </button>
                    <button
                      onClick={() => handleReadChapter(story.chapters[0].server_data[story.chapters[0].server_data.length - 1])}
                      className="bg-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
                    >
                      Chương mới nhất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Story Description */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="text-purple-400" size={24} />
            Mô tả
          </h2>
          <div className="prose prose-invert max-w-none">
            <div 
              className={`text-gray-300 leading-relaxed ${
                !showFullDescription ? 'line-clamp-4' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: story.content || 'Chưa có mô tả' }}
            />
            {story.content && story.content.length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-purple-400 hover:text-purple-300 font-medium mt-3 inline-block"
              >
                {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </div>
        </div>

        {/* Chapter List */}
        {story.chapters && story.chapters.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="text-purple-400" size={24} />
              Danh sách chương
            </h2>

            {/* Server Selection */}
            {story.chapters.length > 1 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {story.chapters.map((server, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveChapterServer(index)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeChapterServer === index
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {server.server_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chapter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {story.chapters[activeChapterServer]?.server_data.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => handleReadChapter(chapter)}
                  className="group bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {chapter.chapter_name}
                      </h3>
                      {chapter.chapter_title && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                          {chapter.chapter_title}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-purple-300 transition-colors" size={18} />
                  </div>
                </button>
              ))}
            </div>

            {/* Empty State */}
            {(!story.chapters[activeChapterServer] || story.chapters[activeChapterServer].server_data.length === 0) && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-400 text-lg">Chưa có chương nào</p>
                <p className="text-gray-500 text-sm">Hãy quay lại sau để đọc những chương mới nhất</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryDetailPage;


