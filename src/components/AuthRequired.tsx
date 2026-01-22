import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthRequiredProps {
  children: React.ReactNode;
  user: any;
  loading: boolean;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({ children, user, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-purple-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Bạn chưa đăng nhập
            </h2>
            <p className="text-gray-600">
              Vui lòng đăng nhập để xem thông tin profile và quản lý dữ liệu cá nhân
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Đăng nhập
            </button>
            
            <button 
              onClick={() => window.location.href = '/register'}
              className="w-full bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Đăng ký tài khoản
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Cần tài khoản để lưu trữ:
            </p>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-4">
                <span>• Truyện yêu thích</span>
                <span>• Lịch sử đọc</span>
              </div>
              <div className="flex items-center justify-center gap-4 mt-1">
                <span>• Tiến độ đọc</span>
                <span>• Cài đặt cá nhân</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRequired;
