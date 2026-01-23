import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, Menu, X, Search, User, Heart, Clock, LogOut, LogIn } from "lucide-react";
import ProfileDropdown from "./ProFileDropDown";
import { useAuth } from "../../hooks/useAuth";

// Mobile Profile Section - inline menu for mobile
const MobileProfileSection = ({ onClose }: { onClose: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      onClose();
      navigate("/");
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (!user) {
    return (
      <Link
        to="/login"
        onClick={onClose}
        className="flex items-center gap-2 mx-4 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm justify-center"
      >
        <LogIn className="w-4 h-4" />
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      {/* User info */}
      <div className="flex items-center gap-3 px-4 py-2 mb-2">
        <img
          src={user.photoURL || 'https://i.pinimg.com/736x/ac/ae/8e/acae8edcbec6d9c92145555bcfee4232.jpg'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">
            {user.displayName || 'Người dùng'}
          </p>
          {user.email && (
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          )}
        </div>
      </div>

      {/* Menu items */}
      <Link
        to="/profile"
        onClick={onClose}
        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <User className="w-4 h-4 mr-3" />
        Thông tin cá nhân
      </Link>

      <Link
        to="/favorites"
        onClick={onClose}
        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Heart className="w-4 h-4 mr-3" />
        Truyện yêu thích
      </Link>

      <Link
        to="/history"
        onClick={onClose}
        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Clock className="w-4 h-4 mr-3" />
        Lịch sử đọc
      </Link>

      <button
        onClick={handleLogout}
        disabled={logoutLoading}
        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
      >
        <LogOut className="w-4 h-4 mr-3" />
        {logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
      </button>
    </div>
  );
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const genres = [
    { name: "Hành động", slug: "action" },
    { name: "Ngôn tình", slug: "ngon-tinh" },
    { name: "Drama", slug: "drama" },
    { name: "Adult", slug: "adult" },
    { name: "Anime", slug: "anime" },
    { name: "Chuyển sinh", slug: "chuyen-sinh" },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsGenreDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="hover:opacity-90 transition-opacity" onClick={closeMobileMenu}>
            <h1 className="text-xl sm:text-2xl font-bold text-green-400">TRUYENTRANVIP</h1>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
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
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/new" className="hover:text-green-400 transition-colors font-medium">
            Truyện Mới
          </Link>

          <Link to="/completed" className="hover:text-green-400 transition-colors font-medium">
            Hoàn Thành
          </Link>

          {/* Genre Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              onMouseEnter={() => setIsGenreDropdownOpen(true)}
              className="hover:text-green-400 transition-colors flex items-center font-medium group"
            >
              Thể Loại
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform duration-200 ${isGenreDropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {isGenreDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                onMouseLeave={() => setIsGenreDropdownOpen(false)}
              >
                <div className="px-4 py-3 border-b border-gray-700 bg-gray-750 rounded-t-lg">
                  <h3 className="text-sm font-semibold text-green-400">Chọn thể loại</h3>
                </div>
                <div className="grid grid-cols-2 gap-1 p-2 max-h-80 overflow-y-auto">
                  {genres.map((genre) => (
                    <Link
                      key={genre.slug}
                      to={`/genre/${genre.slug}`}
                      onClick={() => setIsGenreDropdownOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-colors rounded-md"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-700 p-2">
                  <Link
                    to="/genres"
                    onClick={() => setIsGenreDropdownOpen(false)}
                    className="block w-full text-center px-3 py-2 text-sm text-green-400 hover:bg-gray-700 transition-colors rounded-md font-medium"
                  >
                    Xem tất cả thể loại →
                  </Link>
                </div>
              </div>
            )}

            {isGenreDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsGenreDropdownOpen(false)}
              />
            )}
          </div>

          <ProfileDropdown />
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden mt-3 px-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm truyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 text-white placeholder-gray-400 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors p-1"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-gray-700 pt-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/new"
              onClick={closeMobileMenu}
              className="px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              Truyện Mới
            </Link>

            <Link
              to="/completed"
              onClick={closeMobileMenu}
              className="px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              Hoàn Thành
            </Link>

            {/* Mobile Genre Dropdown */}
            <div>
              <button
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                className="w-full px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors font-medium flex items-center justify-between"
              >
                Thể Loại
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isGenreDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {isGenreDropdownOpen && (
                <div className="bg-gray-800 rounded-lg mt-1 mx-2">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {genres.map((genre) => (
                      <Link
                        key={genre.slug}
                        to={`/genre/${genre.slug}`}
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-colors rounded-md"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 p-2">
                    <Link
                      to="/genres"
                      onClick={closeMobileMenu}
                      className="block w-full text-center px-3 py-2 text-sm text-green-400 hover:bg-gray-700 transition-colors rounded-md font-medium"
                    >
                      Xem tất cả thể loại →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Profile - Inline instead of dropdown */}
            <div className="border-t border-gray-700 mt-2 pt-3">
              <MobileProfileSection onClose={closeMobileMenu} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[-1] md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;