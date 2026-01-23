import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageRanges?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageRanges = 5
}) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfRange = Math.floor(pageRanges / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    // Adjust if we're near the beginning
    if (currentPage <= halfRange) {
      endPage = Math.min(totalPages, pageRanges);
    }

    // Adjust if we're near the end
    if (currentPage > totalPages - halfRange) {
      startPage = Math.max(1, totalPages - pageRanges + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center space-x-1 mt-6">
      {/* First Page */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="p-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Trang đầu"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Trang trước"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Pages */}
      {visiblePages.map((p, index) => (
        <React.Fragment key={index}>
          {p === "..." ? (
            <span className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(p as number)}
              className={`px-3 py-1 rounded transition-colors ${p === currentPage
                ? "bg-blue-600 text-white shadow"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-100"
                }`}
            >
              {p}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Trang sau"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last Page */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="p-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Trang cuối"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
