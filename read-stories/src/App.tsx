import Home from './pages/Home';
import Login from './pages/Login';
import { Routes, Route, useLocation } from 'react-router-dom';
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
function App() {
  const location = useLocation();
  const isReaderPage = location.pathname.includes('/chapter');

  return (
    <>
    <AuthProvider>
      {!isReaderPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new" element={<NewStories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/completed" element={<CompletedStories />} />
        <Route path="/story/:slug" element={<StoryDetailPage />} />
        <Route path="/story/:storySlug/chapter/:chapterFilename" element={<ChapterReader />} />
        <Route path="/story/:storySlug/chapter" element={<ChapterReader />} />
      </Routes>
      {!isReaderPage && <Footer />}
    </AuthProvider>
    </>
  )
}

export default App
