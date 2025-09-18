import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import ProfileDropdown from "./ProFileDropDown";

const Navbar = () => {
  const { user, logout } = useAuthContext(); // user + logout từ AuthContext
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="mr-4 hover:opacity-90 transition-opacity">
            <h1 className="text-2xl font-bold text-green-400">TRUYENTRANHVIP</h1>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm truyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 text-white placeholder-gray-400 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors p-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/new" className="hover:text-green-400 transition-colors font-medium">
            Truyện Mới
          </Link>

          <Link to="/completed" className="hover:text-green-400 transition-colors font-medium">
            Hoàn Thành
          </Link>

          {/* Dropdown Thể loại */}
          <div className="relative group">
            <button className="hover:text-green-400 transition-colors flex items-center font-medium">
              Thể Loại
              <svg
                className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link to="/genre/action" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  Hành động
                </Link>
                <Link to="/genre/romance" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  Lãng mạn
                </Link>
                <Link to="/genre/comedy" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  Hài hước
                </Link>
                <Link to="/genre/horror" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  Kinh dị
                </Link>
                <Link to="/genres" className="block px-4 py-2 text-sm text-green-400 hover:bg-gray-700 hover:text-green-300 transition-colors border-t border-gray-700">
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <ProfileDropdown/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
