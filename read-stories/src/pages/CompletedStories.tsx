import React, { useEffect, useState } from "react";
import StoriesSection from "../components/StoriesSection";
import Pagination from "../components/Pagination";
import { completedStoriesApi } from "../api/homeApi";
import type { CategoryApiResponse, Story } from "../types/api";

interface CompletedStoriesProps {
  title?: string;
}

const CompletedStories: React.FC<CompletedStoriesProps> = ({ title }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [cdnDomain, setCdnDomain] = useState<string>("https://img.otruyenapi.com");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res: CategoryApiResponse = await completedStoriesApi.getCompletedStories(page);
        console.log("thành công", res);

        if (!active) return;

        setStories(res.data.items || []);
        if (res.data.APP_DOMAIN_CDN_IMAGE) setCdnDomain(res.data.APP_DOMAIN_CDN_IMAGE);

        // nếu API có trả về tổng số trang thì lấy
        setTotalPages(res.data.params && (res.data.params as any).pagination?.totalPages || 10); // fallback 10
      } catch (e) {
        if (!active) return;
        setError("Không thể tải danh sách thể loại");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }
  if (stories.length === 0) return null;

  return (
    <div>
      <StoriesSection
        stories={stories}
        cdnDomain={cdnDomain}
        title={title || "TRUYỆN ĐÃ HOÀN THÀNH"}
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

export default CompletedStories;
