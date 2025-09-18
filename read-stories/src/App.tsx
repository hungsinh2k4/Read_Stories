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
        <Route path="/completed" element={<CompletedStories />} />
      </Routes>
      <Footer />
    </AuthProvider>
    </>
  )
}

export default App
