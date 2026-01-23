import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * ReaderLayout - Layout sạch cho trang đọc truyện
 * Không có Navbar/Footer, chỉ render nội dung reader
 * Dùng cho: ChapterReader
 */
const ReaderLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            <Outlet />
        </div>
    );
};

export default ReaderLayout;
