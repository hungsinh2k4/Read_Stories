import Home from './pages/Home';
import Login from './pages/Login';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css'
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';  
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import NewStories from './pages/NewStories';
import CompletedStories from './pages/CompletedStories';
import Profile from './pages/Profile';
import StoryDetailPage from './pages/StoryDetail';
import ChapterReader from './components/ChapterReader';
import SearchPage from './pages/Search';
import FavoritesPage from './pages/Favorites';
import HistoryPage from './pages/History';
import GenrePageWrapper from './pages/GenrePageWrapper';
import GenresPage from './pages/GenresPage';
import NotFound from './pages/NotFound';
function App() {
  const location = useLocation();
  const isReaderPage = location.pathname.includes('/reader');
  
  // Cleanup effect để ngăn DOM conflicts
  useEffect(() => {
    return () => {
      // Clear any existing DOM nodes that might conflict
      const existingNodes = document.querySelectorAll('[data-cleanup]');
      existingNodes.forEach(node => node.remove());
    };
  }, [location.pathname]);
  
  return (
    <>
    <AuthProvider>
        {!isReaderPage && <Navbar />}
        <Routes key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new" element={<NewStories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/completed" element={<CompletedStories />} />
        <Route path="/story/:slug" element={<StoryDetailPage />} />
        <Route path="/story/:storySlug/chapter/:chapterFilename" element={<ChapterReader />} />
        <Route path="/story/:storySlug/chapter" element={<ChapterReader />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/genre/:slug" element={<GenrePageWrapper />} />
        <Route path="/genres" element={<GenresPage />} />
        {/* Catch all unmatched routes - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isReaderPage && <Footer />}
    </AuthProvider>
    </>
  )
}

export default App
