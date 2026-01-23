import React, { useEffect, useState } from 'react';
import StoriesSection from '../components/StoriesSection';
import { CompletedStoriesSkeleton } from '../components/skeletons';
import { newStoriesApi } from '../api/homeApi';
import type { CategoryApiResponse, Story } from '../types/api';
import Pagination from '../components/Pagination';
interface NewStoriesProps {
  title?: string;
}

const NewStories: React.FC<NewStoriesProps> = ({ title }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [cdnDomain, setCdnDomain] = useState<string>('https://img.otruyenapi.com');
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res: CategoryApiResponse = await newStoriesApi.getNewStories(page);
        console.log("thanh cong"); // log ra res để xem dữ liệu
        if (!active) return;
        setStories(res.data.items || []);
        if (res.data.APP_DOMAIN_CDN_IMAGE) setCdnDomain(res.data.APP_DOMAIN_CDN_IMAGE);
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
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (loading) {
    return <CompletedStoriesSkeleton />;
  }

  if (stories.length === 0) {
    return null;
  }

  return (
    // <StoriesSection
    //   stories={stories}
    //   cdnDomain={cdnDomain}
    //   title={title || "TRUYỆN MỚI CẬP NHẬT"}
    //   columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    // />
    <div>
      <StoriesSection
        stories={stories}
        cdnDomain={cdnDomain}
        title={title || "TRUYỆN MỚI CẬP NHẬT"}
        columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      />

      {/* Thanh phân trang */}
      <div className="bg-gray-900 flex justify-center py-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>

  );
};

export default NewStories;


