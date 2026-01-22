import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center space-x-2 mt-6">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
      >
        «
      </button>

      {/* Pages */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded transition-colors ${
            p === currentPage
              ? "bg-blue-600 text-white shadow"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-100"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
