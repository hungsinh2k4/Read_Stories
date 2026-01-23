import React, { useState } from 'react';
import type { Story } from '../../types/api';
import { useAuth } from '../../hooks/useAuth';
import { useUserData } from '../../hooks/useUserData';
import { Link } from 'react-router-dom';
import { Star, Eye, History } from 'lucide-react';

interface SideBarProps {
  stories: Story[];
  cdnDomain?: string;
}

const SideBar: React.FC<SideBarProps> = ({ stories, cdnDomain = 'https://img.otruyenapi.com' }) => {
  const [activeTab, setActiveTab] = useState('ngay');
  const { user } = useAuth();
  const { getStoriesWithProgress } = useUserData(user ? user.uid : null);

  const readingHistoryWithProgress = getStoriesWithProgress();

  const rankingData = stories.slice(0, 9).map((story) => ({
    id: story._id,
    title: story.name,
    views: Math.floor(Math.random() * 200) + 50,
    image: `${cdnDomain}/uploads/comics/${story.thumb_url}`,
    slug: story.slug
  }));

  const recentStories = readingHistoryWithProgress.slice(0, 2).map(story => ({
    id: story._id,
    title: story.name,
    chapter: story.chaptersLatest?.[0] ? `Chương ${story.chaptersLatest[0].chapter_name}` : 'Chương 1',
    image: `${story.thumb_url}`,
    slug: story.slug
  }));

  return (
    <div className="hidden lg:block w-72 xl:w-80 space-y-6 flex-shrink-0">
      {/* Bảng Xếp Hạng */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Star className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" />
          <h3 className="text-lg font-bold text-white">BẢNG XẾP HẠNG</h3>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-4">
          {[
            { key: 'ngay', label: 'Ngày' },
            { key: 'tuan', label: 'Tuần' },
            { key: 'all', label: 'ALL' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === tab.key
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ranking List */}
        <div className="space-y-2">
          {rankingData.map((item, index) => (
            <Link to={`/story/${item.slug}`} key={item.id}>
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded transition-colors cursor-pointer">
                <span className={`font-bold text-sm w-6 ${index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-amber-600' :
                        'text-gray-400'
                  }`}>
                  {index + 1}
                </span>
                <div className="w-10 h-14 xl:w-12 xl:h-16 bg-gray-600 rounded flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{item.title}</h4>
                  <div className="flex items-center text-gray-400 text-xs mt-1">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Truyện Xem Gần Đây */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <History className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-bold text-white">TRUYỆN ĐỌC GẦN ĐÂY</h3>
        </div>

        {/* Recent Stories List */}
        <div className="space-y-2">
          {recentStories.length === 0 && (
            <p className="text-gray-400 text-sm">Chưa có truyện nào được đọc gần đây.</p>
          )}
          {recentStories.map((item) => (
            <Link to={`/story/${item.slug}`} key={item.id}>
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded transition-colors cursor-pointer">
                <div className="w-10 h-14 xl:w-12 xl:h-16 bg-gray-600 rounded flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{item.title}</h4>
                  <p className="text-gray-400 text-xs mt-1">{item.chapter}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
