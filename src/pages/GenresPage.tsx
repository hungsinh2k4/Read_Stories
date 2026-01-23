import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, BookOpen, TrendingUp } from 'lucide-react';
import { getAllGenres } from '../api/storyApi';
import { GenresSkeleton } from '../components/skeletons';

interface Genre {
  _id: string;
  name: string;
  slug: string;
}

const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const genresData = await getAllGenres();
        setGenres(genresData.data.items.map(category => ({
          ...category,
          _id: category.id || category.slug || `genre-${Date.now()}-${Math.random()}` // Use existing ID or generate one
        })));
      } catch (err) {
        console.error('Error loading genres:', err);
        setError('Không thể tải danh sách thể loại');
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading) {
    return <GenresSkeleton />;
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
            onClick={() => window.location.reload()}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Các thể loại nổi bật (có thể hardcode hoặc lấy từ API)
  const featuredGenres = ['hanh-dong', 'ngon-tinh', 'drama', 'shounen'];

  const getFeaturedGenres = () => {
    return genres.filter(genre => featuredGenres.includes(genre.slug));
  };

  const getOtherGenres = () => {
    return genres.filter(genre => !featuredGenres.includes(genre.slug));
  };

  const GenreCard: React.FC<{ genre: Genre; featured?: boolean }> = ({ genre, featured = false }) => (
    <Link
      to={`/genre/${genre.slug}`}
      className={`block p-6 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-xl ${featured
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500 text-white'
        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-purple-500'
        }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <Tag size={24} className={featured ? 'text-white' : 'text-purple-400'} />
        <h3 className={`text-lg font-bold ${featured ? 'text-white' : 'text-white'}`}>
          {genre.name}
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs ${featured ? 'text-purple-200' : 'text-gray-500'}`}>
          Khám phá ngay →
        </span>
        {featured && (
          <div className="flex items-center gap-1 text-yellow-300">
            <TrendingUp size={16} />
            <span className="text-xs">Nổi bật</span>
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Tất cả thể loại
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Khám phá hàng nghìn bộ truyện tranh đa dạng theo từng thể loại yêu thích của bạn
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-purple-400">
            <BookOpen size={20} />
            <span className="text-sm font-medium">
              {genres.length} thể loại có sẵn
            </span>
          </div>
        </div>

        {/* Featured Genres */}
        {getFeaturedGenres().length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="text-yellow-400" size={28} />
              Thể loại nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFeaturedGenres().map((genre) => (
                <GenreCard key={genre._id} genre={genre} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Genres */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Tag className="text-purple-400" size={28} />
            Tất cả thể loại
          </h2>

          {getOtherGenres().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {getOtherGenres().map((genre) => (
                <GenreCard key={genre._id} genre={genre} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {genres.map((genre) => (
                <GenreCard key={genre._id} genre={genre} />
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">
            Thống kê thể loại
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">{genres.length}</div>
              <div className="text-sm text-gray-400">Tổng thể loại</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">1000+</div>
              <div className="text-sm text-gray-400">Bộ truyện</div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">24/7</div>
              <div className="text-sm text-gray-400">Cập nhật</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenresPage;