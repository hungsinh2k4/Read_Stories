import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, BookOpen } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-purple-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Có vẻ như bạn đã lạc đường. Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <BookOpen size={120} className="text-gray-600 animate-bounce" />
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
              ?
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Home size={20} />
            Về Trang Chủ
          </Link>

          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Quay Lại
          </button>

          <Link
            to="/search"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <Search size={20} />
            Tìm Kiếm
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 bg-gray-800 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">
            Bạn có thể thử:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <Link
              to="/new"
              className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                📚
              </div>
              <div>
                <h4 className="font-semibold text-white">Truyện Mới</h4>
                <p className="text-gray-400 text-sm">Khám phá truyện mới nhất</p>
              </div>
            </Link>

            <Link
              to="/completed"
              className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                ✅
              </div>
              <div>
                <h4 className="font-semibold text-white">Truyện Hoàn Thành</h4>
                <p className="text-gray-400 text-sm">Đọc truyện đã hoàn thành</p>
              </div>
            </Link>

            <Link
              to="/genres"
              className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                🏷️
              </div>
              <div>
                <h4 className="font-semibold text-white">Thể Loại</h4>
                <p className="text-gray-400 text-sm">Browse theo thể loại</p>
              </div>
            </Link>

            <Link
              to="/favorites"
              className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                ❤️
              </div>
              <div>
                <h4 className="font-semibold text-white">Yêu Thích</h4>
                <p className="text-gray-400 text-sm">Truyện đã lưu</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>💡 <strong>Fun fact:</strong> Mã lỗi 404 được đặt theo tên phòng 404 tại CERN nơi máy chủ web đầu tiên được đặt!</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
