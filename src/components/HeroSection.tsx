import React from 'react';
import type { Story } from '../types/api';
import { List, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  featuredStory?: Story;
  cdnDomain?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredStory, cdnDomain = 'https://img.otruyenapi.com' }) => {
  return (
    <div className="relative rounded-lg overflow-hidden mb-6 sm:mb-8">
      {/* Full Image Background */}
      <div className="relative h-56 sm:h-72 md:h-96 w-full">
        {featuredStory ? (
          <img
            src={`${cdnDomain}/uploads/comics/${featuredStory.thumb_url}`}
            alt={featuredStory.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-white bg-opacity-20 rounded-full mb-4 mx-auto flex items-center justify-center">
                <svg className="w-10 h-10 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-base sm:text-xl font-medium">Featured Story</div>
            </div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Carousel Navigation Arrows */}
        <button className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 sm:p-3 rounded-full transition-all z-10">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 sm:p-3 rounded-full transition-all z-10">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Read Now Button */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors shadow-lg text-sm sm:text-base">
            Đọc ngay
          </button>
        </div>
      </div>

      {/* Title and Info Below Image */}
      {featuredStory && (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2">{featuredStory.name}</h1>
              {featuredStory.origin_name[0] && (
                <p className="text-gray-300 text-base sm:text-lg mb-2 line-clamp-1">{featuredStory.origin_name[0]}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <span className="flex items-center">
                  <List className="w-4 h-4 mr-1" />
                  <span className="line-clamp-1">{featuredStory.category.map(cat => cat.name).join(', ')}</span>
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {featuredStory.status === 'ongoing' ? 'Đang cập nhật' : 'Hoàn thành'}
                </span>
              </div>
            </div>

            {/* Latest Chapter Info */}
            {featuredStory.chaptersLatest?.[0] && (
              <div className="sm:text-right sm:ml-6 flex-shrink-0">
                <div className="bg-gray-700 rounded-lg p-3 sm:p-4 inline-block sm:block">
                  <h3 className="text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">Chương mới nhất</h3>
                  <p className="text-green-400 font-bold text-base sm:text-lg">
                    Chương {featuredStory.chaptersLatest[0].chapter_name}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-1">
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
