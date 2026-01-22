import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, onDismiss }) => {
  const isPermissionError = error.includes('permission') || error.includes('quyền');
  const isAuthError = error.includes('unauthenticated') || error.includes('đăng nhập');

  return (
    <div className="fixed top-4 right-4 max-w-md bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-start">
        <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={20} />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-1">
            {isPermissionError ? 'Lỗi quyền truy cập' : 
             isAuthError ? 'Lỗi xác thực' : 'Đã có lỗi xảy ra'}
          </h3>
          <p className="text-sm text-red-700 mb-3">{error}</p>
          
          {isPermissionError && (
            <div className="bg-red-100 p-3 rounded text-xs text-red-800 mb-3">
              <p className="font-semibold mb-1">Hướng dẫn khắc phục:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Vào Firebase Console → Firestore Database → Rules</li>
                <li>Cập nhật Security Rules theo FIREBASE_SETUP.md</li>
                <li>Publish rules và thử lại</li>
              </ol>
            </div>
          )}
          
          <div className="flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
              >
                <RefreshCw size={12} />
                Thử lại
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
