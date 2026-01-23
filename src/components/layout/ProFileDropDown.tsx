import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';


const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      console.log("Đăng xuất thành công!");
      setIsOpen(false);
      // Delay navigation để hiển thị loading
      setTimeout(() => {
        navigate("/");
        setLogoutLoading(false);
      }, 500);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      alert("Đăng xuất thất bại!");
      setLogoutLoading(false);
    }
  };


  return (
    <>
      {/* Loading overlay khi đang logout */}
      {logoutLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Đang đăng xuất...</p>
          </div>
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        {user ? (
          <>
            {/* Avatar button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <img
                src={user.photoURL || 'https://i.pinimg.com/736x/ac/ae/8e/acae8edcbec6d9c92145555bcfee4232.jpg'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="py-1">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-white font-medium truncate">
                      {user.displayName || user.email || 'Người dùng'}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    )}
                  </div>

                  {/* Menu items */}
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Thông tin cá nhân
                  </Link>

                  <Link
                    to="/favorites"
                    className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Truyện yêu thích
                  </Link>

                  <Link
                    to="/history"
                    className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lịch sử đọc
                  </Link>

                  <div className="border-t border-gray-700 mt-1">
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {logoutLoading ? (
                        <div className="w-4 h-4 mr-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      )}
                      {logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Đăng nhập
          </Link>
        )}
      </div>
    </>
  );
};

export default ProfileDropdown;
