import React, { useState, useEffect } from "react";
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
  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Use fewer pages on mobile
  const effectivePageRanges = isMobile ? 3 : pageRanges;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfRange = Math.floor(effectivePageRanges / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    // Adjust if we're near the beginning
    if (currentPage <= halfRange) {
      endPage = Math.min(totalPages, effectivePageRanges);
    }

    // Adjust if we're near the end
    if (currentPage > totalPages - halfRange) {
      startPage = Math.max(1, totalPages - effectivePageRanges + 1);
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

  // Common button styles
  const navButtonClass = `
    p-1.5 sm:p-2 rounded 
    bg-white border border-gray-300 text-gray-700 
    hover:bg-blue-100 active:bg-blue-200
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `;

  const pageButtonClass = (isActive: boolean) => `
    px-2 py-1 sm:px-3 sm:py-1.5 rounded 
    text-sm sm:text-base
    transition-colors
    ${isActive
      ? "bg-blue-600 text-white shadow"
      : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 active:bg-blue-200"
    }
  `;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Page info for mobile */}
      <div className="text-sm text-gray-400 sm:hidden">
        Trang {currentPage} / {totalPages}
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-center items-center gap-1 sm:gap-1.5 flex-wrap">
        {/* First Page */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className={navButtonClass}
          title="Trang đầu"
        >
          <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={navButtonClass}
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Pages */}
        {visiblePages.map((p, index) => (
          <React.Fragment key={index}>
            {p === "..." ? (
              <span className="px-1 sm:px-2 text-gray-500 text-sm sm:text-base">...</span>
            ) : (
              <button
                onClick={() => onPageChange(p as number)}
                className={pageButtonClass(p === currentPage)}
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
          className={navButtonClass}
          title="Trang sau"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Last Page */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className={navButtonClass}
          title="Trang cuối"
        >
          <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
