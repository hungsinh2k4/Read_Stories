import { useEffect, useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleFirebaseError = (error: any) => {
    console.error('Firebase Error:', error);
    
    if (error?.code) {
      switch (error.code) {
        case 'permission-denied':
          setError('Không có quyền truy cập. Vui lòng kiểm tra Firebase Security Rules.');
          break;
        case 'not-found':
          setError('Không tìm thấy dữ liệu.');
          break;
        case 'unauthenticated':
          setError('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
          break;
        case 'network-request-failed':
          setError('Lỗi kết nối mạng. Vui lòng kiểm tra internet.');
          break;
        default:
          setError(error.message || 'Đã có lỗi xảy ra');
      }
    } else {
      setError(error.message || 'Đã có lỗi xảy ra');
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // Auto clear error after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    error,
    handleFirebaseError,
    clearError
  };
};
