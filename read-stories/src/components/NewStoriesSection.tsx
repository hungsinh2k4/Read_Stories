import React from 'react';
import type { Story } from '../types/api';

interface NewStoriesSectionProps {
  stories: Story[];
  cdnDomain?: string;
}

const NewStoriesSection: React.FC<NewStoriesSectionProps> = ({ stories, cdnDomain = 'https://img.otruyenapi.com' }) => {
  // Format thời gian cập nhật
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const newStories = stories.map(story => ({
    id: story._id,
    title: story.name,
    views: Math.floor(Math.random() * 200) + 50, // Mock data cho views
    time: formatTimeAgo(story.updatedAt),
    image: `${cdnDomain}/uploads/comics/${story.thumb_url}`,
    slug: story.slug,
    status: story.status,
    chaptersLatest: story.chaptersLatest
  }));

  return (
    <div className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-center mb-8">TRUYỆN TRANH MỚI CẬP NHẬT</h2>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newStories.map((story) => (
            <div key={story.id} className="group cursor-pointer">
              <div className="relative">
                {/* Story Cover */}
                <div className="relative overflow-hidden rounded-lg bg-gray-700 aspect-[3/4] mb-2">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                            <div class="text-center text-gray-400">
                              <div class="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-2"></div>
                              <div class="text-xs">Cover</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                  
                  {/* Time Badge */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {story.time}
                  </div>
                </div>

                {/* Story Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-white group-hover:text-green-400 transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{story.chaptersLatest?.length > 0 ? `Chương ${story.chaptersLatest[0].chapter_name}` : "Chưa có"}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{story.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewStoriesSection;
