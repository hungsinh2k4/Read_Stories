import React, { useState } from 'react';
import { Heart, BookOpen, Clock, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthRequired from '../components/AuthRequired';
import ErrorDisplay from '../components/ErrorDisplay';
import { FavoritesSkeleton } from '../components/skeletons';
import { useAuthContext } from '../contexts/AuthContext';
import { useUserDataContext } from '../contexts/UserDataContext';
import { toast, ToastContainer } from 'react-toastify';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, error: authError } = useAuthContext();
  const {
    loading: dataLoading,
    error: dataError,
    getFavoriteStoriesWithProgress,
    removeFromFavorites: removeFromFavoritesHook
  } = useUserDataContext();

  const loading = authLoading || dataLoading;
  const favoriteStoriesWithProgress = getFavoriteStoriesWithProgress();

  const [removingStoryId, setRemovingStoryId] = useState<string | null>(null);

  const handleRemoveFromFavorites = async (storyId: string, storyName: string) => {
    if (!user) return;

    const confirmRemove = window.confirm(`Bạn có chắc muốn xóa "${storyName}" khỏi danh sách yêu thích?`);
    if (!confirmRemove) return;

    setRemovingStoryId(storyId);
    try {
      await removeFromFavoritesHook(storyId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Có lỗi khi xóa truyện khỏi danh sách yêu thích');
    } finally {
      setRemovingStoryId(null);
    }
  };

  const handleReadStory = (story: any) => {
    navigate(`/story/${story.slug}`);
  };

  const handleContinueReading = (story: any) => {
    // Simply navigate to the story page, let the story detail page handle chapter selection
    navigate(`/story/${story.slug}`);
  };

  return (
    <AuthRequired user={user} loading={authLoading}>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-red-400" size={32} />
              <h1 className="text-3xl font-bold text-white">Truyện yêu thích</h1>
            </div>
            <p className="text-gray-300">
              Quản lý danh sách truyện yêu thích của bạn
            </p>
          </div>

          {/* Loading */}
          {loading && <FavoritesSkeleton />}

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
              {favoriteStoriesWithProgress.length > 0 ? (
                <div className="grid gap-6">
                  {favoriteStoriesWithProgress.map((story) => {
                    const isRemoving = removingStoryId === story._id;

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

                              {story.readChapters > 0 && (
                                <div className="flex items-center gap-1 text-blue-400">
                                  <Clock size={16} />
                                  <span className="text-sm">
                                    Đã đọc: {story.readChapters}/{story.totalChapters} chương
                                  </span>
                                </div>
                              )}
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
                            {story.progress > 0 && (
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
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            {story.readChapters > 0 ? (
                              <button
                                onClick={() => handleContinueReading(story)}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                              >
                                <BookOpen size={16} />
                                Tiếp tục đọc
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReadStory(story)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                              >
                                <ArrowRight size={16} />
                                Đọc truyện
                              </button>
                            )}

                            <button
                              onClick={() => handleRemoveFromFavorites(story._id, story.name)}
                              disabled={isRemoving}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
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
                  <Heart className="mx-auto text-gray-600 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Chưa có truyện yêu thích
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Hãy thêm những truyện bạn yêu thích vào danh sách này
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <BookOpen size={20} />
                    Khám phá truyện mới
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthRequired>
  );
};

export default FavoritesPage;
