import React from 'react';
import type { Story } from '../types/api';

interface HeroSectionProps {
  featuredStory?: Story;
  cdnDomain?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredStory, cdnDomain = 'https://img.otruyenapi.com' }) => {
  return (
    <div className="relative rounded-lg overflow-hidden mb-8">
      {/* Full Image Background */}
      <div className="relative h-96 w-full">
        {featuredStory ? (
          <img 
            src={`${cdnDomain}/uploads/comics/${featuredStory.thumb_url}`}
            alt={featuredStory.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full mb-4 mx-auto flex items-center justify-center">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xl font-medium">Featured Story</div>
            </div>
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Carousel Navigation Arrows */}
        <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Read Now Button */}
        <div className="absolute bottom-4 left-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">
            Đọc ngay
          </button>
        </div>
      </div>

      {/* Title and Info Below Image */}
      {featuredStory && (
        <div className="bg-gray-800 p-6 rounded-b-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{featuredStory.name}</h1>
              {featuredStory.origin_name[0] && (
                <p className="text-gray-300 text-lg mb-2">{featuredStory.origin_name[0]}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  {featuredStory.category.map(cat => cat.name).join(', ')}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {featuredStory.status === 'ongoing' ? 'Đang cập nhật' : 'Hoàn thành'}
                </span>
              </div>
            </div>
            
            {/* Latest Chapter Info */}
            {featuredStory.chaptersLatest?.[0] && (
              <div className="text-right ml-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Chương mới nhất</h3>
                  <p className="text-green-400 font-bold text-lg">
                    Chương {featuredStory.chaptersLatest[0].chapter_name}
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    {featuredStory.chaptersLatest[0].filename}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
