import React, { useEffect, useState } from 'react';
import StoriesSection from '../components/StoriesSection';
import { newStoriesApi } from '../api/homeApi';
import type { CategoryApiResponse, Story } from '../types/api';

interface NewStoriesProps {
  title?: string;
  page?: number;
}

const NewStories: React.FC<NewStoriesProps> = ({ title, page = 1 }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [cdnDomain, setCdnDomain] = useState<string>('https://img.otruyenapi.com');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading || error) {
    return null;
  }

  if (stories.length === 0) {
    return null;
  }

  return (
    <StoriesSection
      stories={stories}
      cdnDomain={cdnDomain}
      title={title || "TRUYỆN MỚI CẬP NHẬT"}
      columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    />
  );
};

export default NewStories;


