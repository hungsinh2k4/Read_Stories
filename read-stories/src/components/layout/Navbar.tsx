import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProfileDropdown from "./ProFileDropDown";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to search page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search input
    }
  };

  // Danh sách thể loại với slug phù hợp
  const genres = [
    { name: "Hành động", slug: "action" },
    { name: "Ngôn tình", slug: "ngon-tinh" },
    { name: "Drama", slug: "drama" },
    { name: "Adult", slug: "adult" },
    { name: "Anime", slug: "anime" },
    { name: "Chuyển sinh", slug: "chuyen-sinh" },
  ];

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
          {/* Improved Dropdown Thể loại */}
          <div className="relative">
            <button 
              onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              onMouseEnter={() => setIsGenreDropdownOpen(true)}
              className="hover:text-green-400 transition-colors flex items-center font-medium group"
            >
              Thể Loại
              <ChevronDown 
                size={16} 
                className={`ml-1 transition-transform duration-200 ${
                  isGenreDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Improved Dropdown Menu */}
            {isGenreDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 animate-fade-in"
                onMouseLeave={() => setIsGenreDropdownOpen(false)}
              >
                {/* Dropdown Header */}
                <div className="px-4 py-3 border-b border-gray-700 bg-gray-750 rounded-t-lg">
                  <h3 className="text-sm font-semibold text-green-400">Chọn thể loại</h3>
                </div>

                {/* Genre Grid */}
                <div className="grid grid-cols-2 gap-1 p-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
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

            {/* Backdrop to close dropdown */}
            {isGenreDropdownOpen && (
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsGenreDropdownOpen(false)}
              />
            )}
          </div>

          {/* Profile Dropdown */}
          <ProfileDropdown/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;