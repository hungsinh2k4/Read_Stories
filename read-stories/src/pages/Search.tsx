import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Loader } from 'lucide-react';
import { searchApi } from '../api/storyApi';
import StoriesSection from '../components/StoriesSection';
import type { StoryDetails } from '../types/story';
import type { Story } from '../types/api';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Convert StoryDetails to Story format
  const convertToStory = (storyDetails: StoryDetails): Story => ({
    _id: storyDetails._id,
    name: storyDetails.name,
    slug: storyDetails.slug,
    origin_name: storyDetails.origin_name,
    status: storyDetails.status,
    thumb_url: storyDetails.thumb_url,
    sub_docquyen: storyDetails.sub_docquyen,
    category: storyDetails.category,
    updatedAt: storyDetails.updatedAt,
    chaptersLatest: storyDetails.chaptersLatest.map(chapter => ({
      filename: chapter.filename,
      chapter_name: chapter.chapter_name,
      chapter_title: chapter.chapter_title || '',
      chapter_api_data: chapter.chapter_api_data
    }))
  });

  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await searchApi(searchQuery);
      const searchResults = response.data.items || [];
      const convertedStories = searchResults.map(convertToStory);
      setStories(convertedStories);
    } catch (err) {
      console.error('Search error:', err);
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="text-green-400" size={28} />
            <h1 className="text-3xl font-bold text-white">Kết quả tìm kiếm</h1>
          </div>
          
          {query && (
            <p className="text-gray-300 text-lg">
              Tìm kiếm cho: <span className="text-green-400 font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-white">
              <Loader className="animate-spin" size={24} />
              <span className="text-lg">Đang tìm kiếm...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-8">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* No query */}
        {!query && !loading && (
          <div className="text-center py-20">
            <SearchIcon className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-xl">Nhập từ khóa để bắt đầu tìm kiếm</p>
          </div>
        )}

        {/* Results */}
        {hasSearched && !loading && !error && (
          <div>
            {stories.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-300">
                    Tìm thấy <span className="text-green-400 font-semibold">{stories.length}</span> kết quả
                  </p>
                </div>
                
                <StoriesSection 
                  title=""
                  stories={stories}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="text-gray-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-400">
                  Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
