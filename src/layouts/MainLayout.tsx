import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * MainLayout - Layout chính với Navbar và Footer
 * Dùng cho: Home, Search, GenresPage, StoryDetail, Profile, etc.
 */
const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
