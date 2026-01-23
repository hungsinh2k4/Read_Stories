import React from 'react';
import type { Story } from '../types/api';
import { Link } from 'react-router-dom';
import { List, Eye } from 'lucide-react';
interface StoriesSectionProps {
  stories: Story[];
  cdnDomain?: string;
  title?: string;
  columnsClassName?: string;
  showTimeBadge?: boolean;
}

const StoriesSection: React.FC<StoriesSectionProps> = ({
  stories,
  cdnDomain = 'https://img.otruyenapi.com',
  title,
  columnsClassName = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  showTimeBadge = true,
}) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  return (
    <div className="bg-gray-900 text-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-8">{title}</h2>
        )}

        <div className={`grid ${columnsClassName} gap-2 sm:gap-4`}>
          {stories
            .filter((story) => story.chaptersLatest?.[0]?.chapter_name)
            .map((story) => (
              <Link key={story._id} to={`/story/${story.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-lg bg-gray-700 aspect-[3/4] mb-2">
                      <img
                        src={`${cdnDomain}/uploads/comics/${story.thumb_url}`}
                        alt={story.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                      {showTimeBadge && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {formatTimeAgo(story.updatedAt)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-white group-hover:text-green-400 transition-colors line-clamp-2">
                        {story.name}
                      </h3>

                      <p className="text-gray-400 text-xs line-clamp-1">{story.origin_name[0] || story.name}</p>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center">
                          <List className="w-3 h-3 mr-1" />
                          <span>
                            {story.chaptersLatest?.length > 0 ? `Chương ${story.chaptersLatest[0].chapter_name}` : 'Chưa có'}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{Math.floor(Math.random() * 200) + 50}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesSection;


