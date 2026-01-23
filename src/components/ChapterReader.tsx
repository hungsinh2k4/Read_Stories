import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, X, Home } from 'lucide-react';
import { fetchStoryDetails, fetchChapterContent, getChapterList, findChapterByFilename, getAdjacentChapter } from '../api/storyApi';
import { ChapterReaderSkeleton } from './skeletons';
import type { StoryDetails, ChapterData } from '../types/story';

interface ChapterReaderProps { }

const ChapterReader: React.FC<ChapterReaderProps> = () => {
  const { storySlug, chapterFilename } = useParams<{
    storySlug: string;
    chapterFilename: string;
  }>();

  const navigate = useNavigate();

  const [storyDetails, setStoryDetails] = useState<StoryDetails | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterData | null>(null);
  const [chapterImages, setChapterImages] = useState<string[]>([]);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [showChapterList, setShowChapterList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load story details và chapter list
  useEffect(() => {
    const loadStoryData = async () => {
      if (!storySlug) return;

      try {
        setLoading(true);
        const story = await fetchStoryDetails(storySlug);
        setStoryDetails(story);

        const chapterList = getChapterList(story);
        setChapters(chapterList);

        // Nếu không có chapterFilename, chọn chapter đầu tiên
        const targetFilename = chapterFilename || (chapterList[0]?.filename);
        if (targetFilename) {
          const chapter = findChapterByFilename(chapterList, targetFilename);
          if (chapter) {
            setCurrentChapter(chapter);
            await loadChapterContent(chapter.chapter_api_data);
          }
        }
      } catch (err) {
        setError('Không thể tải truyện');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStoryData();
  }, [window.scroll(0, 0), storySlug, chapterFilename]);

  // Load nội dung chapter
  const loadChapterContent = async (chapterApiData: string) => {
    try {
      setLoading(true);
      const images = await fetchChapterContent(chapterApiData);
      setChapterImages(images);
    } catch (err) {
      setError('Không thể tải nội dung chapter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Chuyển chapter
  const navigateToChapter = async (chapter: ChapterData) => {
    setCurrentChapter(chapter);
    setShowChapterList(false);
    await loadChapterContent(chapter.chapter_api_data);

    // Update URL
    navigate(`/story/${storySlug}/chapter/${chapter.filename}`, { replace: true });
  };

  // Chapter trước/sau
  const goToPrevChapter = () => {
    if (!currentChapter) return;
    const prevChapter = getAdjacentChapter(chapters, currentChapter.filename, 'prev');
    if (prevChapter) {
      navigateToChapter(prevChapter);
    }
  };

  const goToNextChapter = () => {
    if (!currentChapter) return;
    const nextChapter = getAdjacentChapter(chapters, currentChapter.filename, 'next');
    if (nextChapter) {
      navigateToChapter(nextChapter);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevChapter();
          break;
        case 'ArrowRight':
          goToNextChapter();
          break;
        case 'Escape':
          setShowChapterList(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentChapter, chapters]);

  if (loading) {
    return <ChapterReaderSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  const prevChapter = currentChapter ? getAdjacentChapter(chapters, currentChapter.filename, 'prev') : null;
  const nextChapter = currentChapter ? getAdjacentChapter(chapters, currentChapter.filename, 'next') : null;

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Header với thông tin truyện */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm z-40 p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Home size={20} />
            </button>
            <div>
              <h1 className="font-bold text-lg truncate max-w-xs">
                {storyDetails?.name}
              </h1>
              <p className="text-sm text-gray-300 truncate">
                {currentChapter?.chapter_name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowChapterList(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <List size={18} />
            <span>Danh sách chương</span>
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30">
        <button
          onClick={goToPrevChapter}
          disabled={!prevChapter}
          className="p-3 bg-gray-800/80 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30">
        <button
          onClick={goToNextChapter}
          disabled={!nextChapter}
          className="p-3 bg-gray-800/80 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Nội dung ảnh */}
      <div className="pt-20 pb-8 reader-container">
        <div className="max-w-4xl mx-auto px-4">
          {chapterImages.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-20">
              <p>Không có nội dung để hiển thị</p>
            </div>
          )}

          {chapterImages.map((imageUrl, index) => (
            <div key={index} className="mb-2">
              <img
                src={imageUrl}
                alt={`Trang ${index + 1}`}
                className="chapter-image w-full h-auto block mx-auto"
                loading={index < 5 ? 'eager' : 'lazy'}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.classList.remove('loading');
                }}
                onLoadStart={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.classList.add('loading');
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  console.log(`Failed to load image: ${imageUrl}`);
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation bottom */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={goToPrevChapter}
            disabled={!prevChapter}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
            Chương trước
          </button>

          <button
            onClick={goToNextChapter}
            disabled={!nextChapter}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            Chương sau
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Chapter List Modal */}
      {showChapterList && (
        <div className="fixed inset-0 bg-black/80 z-50 flex">
          {/* Sidebar danh sách chapter */}
          <div className="w-80 bg-gray-800 h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-white font-bold">Danh sách chương</h2>
              <button
                onClick={() => setShowChapterList(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-2">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.filename}
                  onClick={() => navigateToChapter(chapter)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${currentChapter?.filename === chapter.filename
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <div className="font-medium">Chương {index + 1}</div>
                  <div className="text-sm opacity-80 truncate">
                    {chapter.chapter_name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Backdrop để đóng modal */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setShowChapterList(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChapterReader;
