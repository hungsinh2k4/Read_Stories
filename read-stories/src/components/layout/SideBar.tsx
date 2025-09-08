import React, { useState } from 'react';
import type { Story } from '../../types/api';

interface SideBarProps {
  stories: Story[];
  cdnDomain?: string;
}

const SideBar: React.FC<SideBarProps> = ({ stories, cdnDomain = 'https://img.otruyenapi.com' }) => {
  const [activeTab, setActiveTab] = useState('ngay');

  // Lấy top 9 truyện cho bảng xếp hạng (có thể sắp xếp theo tiêu chí khác nhau)
  const rankingData = stories.slice(0, 9).map((story, index) => ({
    id: story._id,
    title: story.name,
    views: Math.floor(Math.random() * 200) + 50, // Mock data cho views
    image: `${cdnDomain}/uploads/comics/${story.thumb_url}`,
    slug: story.slug
  }));

  // Lấy 2 truyện gần đây (có thể từ localStorage hoặc state)
  const recentStories = stories.slice(0, 2).map(story => ({
    id: story._id,
    title: story.name,
    chapter: story.chaptersLatest?.[0] ? `Chương ${story.chaptersLatest[0].chapter_name}` : 'Chương 1',
    image: `${cdnDomain}/uploads/comics/${story.thumb_url}`,
    slug: story.slug
  }));

  return (
    <div className="w-80 space-y-6">
      {/* Bảng Xếp Hạng */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
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
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === tab.key
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
            <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded transition-colors cursor-pointer">
              <span className="text-gray-400 font-bold text-sm w-6">{index + 1}</span>
              <div className="w-12 h-16 bg-gray-600 rounded flex-shrink-0 overflow-hidden">
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
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{item.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Truyện Xem Gần Đây */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h3 className="text-lg font-bold text-white">TRUYỆN XEM GẦN ĐÂY</h3>
        </div>

        {/* Recent Stories List */}
        <div className="space-y-2">
          {recentStories.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded transition-colors cursor-pointer">
              <div className="w-12 h-16 bg-gray-600 rounded flex-shrink-0 overflow-hidden">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
