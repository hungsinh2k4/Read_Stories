import React, { useState, useEffect } from 'react';
import SideBar from '../components/layout/SideBar';
import NewStoriesSection from '../components/NewStoriesSection';
import CategorySection from '../components/CategorySection';
import { homeApi } from '../api/homeApi';
import type { HomeApiResponse } from '../types/api';

const Home: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const data = await homeApi.getHomeData();
        setHomeData(data);
      } catch (err) {
        setError('Không thể tải dữ liệu trang chủ');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [window.scroll(0, 0)]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || 'Có lỗi xảy ra'}</div>
      </div>
    );
  }

  const stories = homeData.data.items;
  const cdnDomain = homeData.data.APP_DOMAIN_CDN_IMAGE;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Content Area - Full width on mobile, flex-1 on desktop */}
          <div className="flex-1 min-w-0">
            {/* Category Sections */}
            <NewStoriesSection
              stories={stories}
              cdnDomain={cdnDomain}
            />
            <CategorySection slug="manga" title="MANGA" />
            <CategorySection slug="manhwa" title="MANHWA" />
            <CategorySection slug="manhua" title="MANHUA" />
          </div>

          {/* Sidebar - Hidden on mobile, visible on lg+ */}
          <SideBar
            stories={stories}
            cdnDomain={cdnDomain}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;