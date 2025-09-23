import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StoryDetailPage from '../pages/StoryDetail';

const StoryDetailDemo: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StoryDetailPage />} />
        <Route path="/story/:slug" element={<StoryDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default StoryDetailDemo;
