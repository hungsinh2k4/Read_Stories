import Home from './pages/Home';
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import './index.css'
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';  
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import NewStories from './pages/NewStories';
import CompletedStories from './pages/CompletedStories';
import Profile from './pages/Profile';
import StoryDetailPage from './pages/StoryDetail';
function App() {
  return (
    <>
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new" element={<NewStories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/completed" element={<CompletedStories />} />
        <Route path="/story/:slug" element={<StoryDetailPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
    </>
  )
}

export default App
