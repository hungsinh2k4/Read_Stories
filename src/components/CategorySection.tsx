import React, { useEffect, useState } from 'react';
import StoriesSection from './StoriesSection';
import Pagination from './Pagination';
import { StoriesGridSkeleton } from './skeletons';
import { categoryApi } from '../api/homeApi';
import type { CategoryApiResponse, Story } from '../types/api';

interface CategorySectionProps {
  slug: string; // e.g. 'manga', 'manhwa', 'manhua', 'action', 'romance'
  title?: string;
  page?: number;
  showPagination?: boolean;
  onPageChange?: (page: number) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  slug,
  title,
  page = 1,
  showPagination = false,
  onPageChange
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [cdnDomain, setCdnDomain] = useState<string>('https://img.otruyenapi.com');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res: CategoryApiResponse = await categoryApi.getMangaData(page, slug);
        console.log("thanh cong"); // log ra res để xem dữ liệu
        if (!active) return;
        setStories(res.data.items || []);
        if (res.data.APP_DOMAIN_CDN_IMAGE) setCdnDomain(res.data.APP_DOMAIN_CDN_IMAGE);

        // Tính totalPages từ totalItems / itemsPerPage
        const pagination = res.data.params && (res.data.params as any).pagination;
        const totalItems = pagination?.totalItems || 0;
        const itemsPerPage = pagination?.totalItemsPerPage || 24;
        setTotalPages(Math.ceil(totalItems / itemsPerPage) || 1);
      } catch (e) {
        if (!active) return;
        setError('Không thể tải danh sách thể loại');
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [slug, page]);

  useEffect(() => {
    if (showPagination) {
      window.scrollTo(0, 0);
    }
  }, [page, showPagination]);

  if (loading) {
    return (
      <StoriesGridSkeleton
        count={12}
        columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        showTitle={!!title}
      />
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (stories.length === 0) {
    return null;
  }

  return (
    <div>
      <StoriesSection
        stories={stories}
        cdnDomain={cdnDomain}
        title={title || slug.toUpperCase()}
        columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      />
      {showPagination && totalPages > 1 && (
        <div className="bg-gray-900 flex justify-center py-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
};

export default CategorySection;


