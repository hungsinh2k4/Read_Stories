import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout, ReaderLayout } from './layouts';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
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
  const [domReady, setDomReady] = useState(false);

  // Ensure DOM is ready before rendering
  useEffect(() => {
    const timer = setTimeout(() => setDomReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup effect để ngăn DOM conflicts
  useEffect(() => {
    // Global error handler để catch DOM errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.name === 'NotFoundError' &&
        event.error?.message?.includes('insertBefore')) {
        console.warn('Suppressed DOM insertion error:', event.error.message);
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      // Clear any existing DOM nodes that might conflict
      const existingNodes = document.querySelectorAll('[data-cleanup]');
      existingNodes.forEach(node => node.remove());
    };
  }, [location.pathname]);

  if (!domReady) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes key={location.pathname}>
          {/* Routes với MainLayout (có Navbar + Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/new" element={<NewStories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/completed" element={<CompletedStories />} />
            <Route path="/story/:slug" element={<StoryDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/genre/:slug" element={<GenrePageWrapper />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Routes với ReaderLayout (không có Navbar/Footer) */}
          <Route element={<ReaderLayout />}>
            <Route path="/story/:storySlug/chapter/:chapterFilename" element={<ChapterReader />} />
            <Route path="/story/:storySlug/chapter" element={<ChapterReader />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
