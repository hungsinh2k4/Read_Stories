import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CategorySection from "../components/CategorySection";
import { getAllGenres } from "../api/storyApi";

interface GenreData {
  slug: string;
  name: string;
}

const GenrePageWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [genres, setGenres] = useState<GenreData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy danh sách thể loại từ API
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await getAllGenres();
        // Chỉ lấy slug và name
        const genreMap = genresData.data.items.map(category => ({
          slug: category.slug,
          name: category.name
        }));
        setGenres(genreMap);
      } catch (error) {
        console.error('Error loading genres:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGenres();
  }, []);
  
  // Tìm title từ API data
  const getGenreTitle = (slug: string): string => {
    if (loading || genres.length === 0) {
      // Fallback mapping khi chưa load được API
      const fallbackMap: Record<string, string> = {
        'hanh-dong': 'Hành Động',
        'ngon-tinh': 'Ngôn Tình', 
        'drama': 'Drama',
        'kinh-di': 'Kinh Dị',
        'hai-huoc': 'Hài Hước',
        'hoc-duong': 'Học Đường',
        'shounen': 'Shounen',
        'shoujo': 'Shoujo',
        'seinen': 'Seinen',
        'josei': 'Josei',
        'fantasy': 'Fantasy',
        'sci-fi': 'Sci-Fi'
      };
      return fallbackMap[slug] || slug?.charAt(0).toUpperCase() + slug?.slice(1) || 'Thể loại';
    }
    
    // Tìm từ API data
    const foundGenre = genres.find(genre => genre.slug === slug);
    return foundGenre ? foundGenre.name : (slug?.charAt(0).toUpperCase() + slug?.slice(1) || 'Thể loại');
  };

  if (!slug) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Thể loại không tồn tại</div>
      </div>
    );
  }

  // Hiển thị loading khi đang lấy dữ liệu thể loại
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải thông tin thể loại...</p>
        </div>
      </div>
    );
  }

  return (
    <CategorySection 
      slug={slug} 
      title={getGenreTitle(slug)} 
    />
  );
};
export default GenrePageWrapper;