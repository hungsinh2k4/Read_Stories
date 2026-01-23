import React, { useState } from 'react';
import { Clock, BookOpen, Trash2, ArrowRight, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthRequired from '../components/AuthRequired';
import ErrorDisplay from '../components/ErrorDisplay';
import { HistorySkeleton } from '../components/skeletons';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import { ToastContainer, toast } from 'react-toastify';


const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, error: authError } = useAuth();
  const {
    loading: dataLoading,
    error: dataError,
    getStoriesWithProgress,
    addToFavorites,
    isStoryFavorite
  } = useUserData(user?.uid || null);

  const loading = authLoading || dataLoading;
  const readingHistoryWithProgress = getStoriesWithProgress();

  const [removingStoryId] = useState<string | null>(null);
  const [addingToFavorite, setAddingToFavorite] = useState<string | null>(null);

  const handleContinueReading = (story: any) => {
    navigate(`/story/${story.slug}`);
  };

  const handleAddToFavorites = async (story: any) => {
    if (!user) return;

    setAddingToFavorite(story._id);
    try {
      await addToFavorites(
        story._id,
        story.name,
        story.slug,
        story.thumb_url,
        story.status || 'Đang cập nhật',
        story.category?.[0]?.name || 'Truyện tranh'
      );
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast('Có lỗi khi thêm vào danh sách yêu thích');
    } finally {
      setAddingToFavorite(null);
    }
  };

  const handleRemoveFromHistory = (_storyId: string, storyName: string) => {
    // For now, just show a message. In a real app, you'd implement this feature
    toast(`Tính năng xóa lịch sử "${storyName}" sẽ được cập nhật trong phiên bản tới`);
  };

  // Sort by lastRead (most recent first)
  const sortedHistory = [...readingHistoryWithProgress].sort(
    (a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime()
  );

  return (
    <AuthRequired user={user} loading={authLoading}>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-blue-400" size={32} />
              <h1 className="text-3xl font-bold text-white">Lịch sử đọc</h1>
            </div>
            <p className="text-gray-300">
              Các truyện bạn đã đọc gần đây
            </p>
          </div>

          {/* Loading */}
          {loading && <HistorySkeleton />}

          {/* Error */}
          {(authError || dataError) && (
            <ErrorDisplay
              error={authError || dataError || ''}
              onRetry={() => window.location.reload()}
            />
          )}

          {/* Content */}
          {!loading && (
            <div>
              {sortedHistory.length > 0 ? (
                <div className="grid gap-6">
                  {sortedHistory.map((story) => {
                    const isRemoving = removingStoryId === story._id;
                    const isAddingFav = addingToFavorite === story._id;
                    const isFavorited = isStoryFavorite(story._id);

                    return (
                      <div
                        key={story._id}
                        className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex gap-4">
                          {/* Story Image */}
                          <Link
                            to={`/story/${story.slug}`}
                            className="flex-shrink-0"
                          >
                            <img
                              src={story.thumb_url || '/placeholder.jpg'}
                              alt={story.name}
                              className="w-20 h-28 object-cover rounded-lg hover:opacity-80 transition-opacity"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = '/placeholder.jpg';
                              }}
                            />
                          </Link>

                          {/* Story Info */}
                          <div className="flex-1">
                            <Link
                              to={`/story/${story.slug}`}
                              className="block"
                            >
                              <h3 className="text-xl font-semibold text-white mb-2 hover:text-green-400 transition-colors">
                                {story.name}
                              </h3>
                            </Link>

                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-1 text-gray-300">
                                <BookOpen size={16} />
                                <span className="text-sm">{story.status}</span>
                              </div>

                              <div className="flex items-center gap-1 text-blue-400">
                                <Clock size={16} />
                                <span className="text-sm">
                                  Đã đọc: {story.readChapters}/{story.totalChapters} chương
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-gray-400">
                                <Clock size={16} />
                                <span className="text-sm">
                                  {new Date(story.lastRead).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            </div>

                            {/* Categories */}
                            {story.category && story.category.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {story.category.slice(0, 3).map((cat: any) => (
                                  <span
                                    key={cat.id}
                                    className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                                  >
                                    {cat.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Tiến độ đọc</span>
                                <span className="text-sm text-blue-400">
                                  {Math.round(story.progress)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.round(story.progress)}%`
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Rating */}
                            {story.rating > 0 && (
                              <div className="flex items-center gap-1 text-yellow-400">
                                <span className="text-sm">Đánh giá của bạn:</span>
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < story.rating ? 'text-yellow-400' : 'text-gray-600'}>
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleContinueReading(story)}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              <ArrowRight size={16} />
                              Tiếp tục đọc
                            </button>

                            {!isFavorited && (
                              <button
                                onClick={() => handleAddToFavorites(story)}
                                disabled={isAddingFav}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                              >
                                {isAddingFav ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <Heart size={16} />
                                )}
                                {isAddingFav ? 'Đang thêm...' : 'Yêu thích'}
                              </button>
                            )}

                            <button
                              onClick={() => handleRemoveFromHistory(story._id, story.name)}
                              disabled={isRemoving}
                              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              {isRemoving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <Trash2 size={16} />
                              )}
                              {isRemoving ? 'Đang xóa...' : 'Xóa'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Clock className="mx-auto text-gray-600 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Chưa có lịch sử đọc
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Bắt đầu đọc truyện để xem lịch sử ở đây
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <BookOpen size={20} />
                    Khám phá truyện mới
                  </Link>
                </div>
              )}
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </AuthRequired>
  );
};

export default HistoryPage;
