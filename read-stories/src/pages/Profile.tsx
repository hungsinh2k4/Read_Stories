import React, { useState, useEffect } from 'react';
import { Settings, Heart, Clock, BookOpen, Camera, Star, Award, Bell } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import AuthRequired from '../components/AuthRequired';
import ErrorDisplay from '../components/ErrorDisplay';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import { userDataService } from '../services/userDataService';
import { addSampleData } from '../services/sampleData';

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Use Firebase authentication and user data
  const { user, userProfile, loading: authLoading, refreshUserProfile, error: authError } = useAuth();
  const { 
    loading: dataLoading, 
    error: dataError,
    getFavoriteStoriesWithProgress, 
    getStoriesWithProgress 
  } = useUserData(user?.uid || null);

  const loading = authLoading || dataLoading;

  // Get stories with progress info for display
  const favoriteStoriesWithProgress = getFavoriteStoriesWithProgress();
  const readingHistoryWithProgress = getStoriesWithProgress();

  // Settings state
  const [settings, setSettings] = useState({
    displayName: userProfile?.displayName || '',
    email: userProfile?.email || '',
    notifications: userProfile?.settings?.notifications ?? true,
    darkMode: userProfile?.settings?.darkMode ?? false,
    autoBookmark: userProfile?.settings?.autoBookmark ?? true
  });

  // Update settings when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setSettings({
        displayName: userProfile.displayName,
        email: userProfile.email,
        notifications: userProfile.settings?.notifications ?? true,
        darkMode: userProfile.settings?.darkMode ?? false,
        autoBookmark: userProfile.settings?.autoBookmark ?? true
      });
    }
  }, [userProfile]);

  const handleAvatarUpload = () => {
    // Simulate avatar upload
    showToast('Đã cập nhật ảnh đại diện thành công!');
  };

  const handleAddSampleData = async () => {
    if (!user) return;
    
    try {
      const result = await addSampleData(user.uid);
      if (result.success) {
        showToast('Đã thêm dữ liệu mẫu thành công!');
        // Refresh data
        window.location.reload();
      } else {
        showToast('Có lỗi khi thêm dữ liệu mẫu: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding sample data:', error);
      showToast('Có lỗi khi thêm dữ liệu mẫu!');
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    try {
      await userDataService.updateUserSettings(user.uid, {
        notifications: settings.notifications,
        darkMode: settings.darkMode,
        autoBookmark: settings.autoBookmark
      });
      
      // Update display name and email if changed
      if (settings.displayName !== userProfile?.displayName || settings.email !== userProfile?.email) {
        await userDataService.createOrUpdateUserProfile(user.uid, {
          displayName: settings.displayName,
          email: settings.email
        });
      }
      
      // Refresh user profile
      if (refreshUserProfile) {
        await refreshUserProfile();
      }
      
      showToast('Đã lưu cài đặt thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Có lỗi khi lưu cài đặt!');
    }
  };

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long'
    });
  };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-white text-lg">Đang tải thông tin...</p>
//         </div>
//       </div>
//     );
//   }\
if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <AuthRequired user={user} loading={loading}>
      {/* Error Display */}
      {(authError || dataError) && (
        <ErrorDisplay 
          error={authError || dataError || 'Đã có lỗi xảy ra'}
          onRetry={() => window.location.reload()}
          onDismiss={() => {
            // Clear errors by refreshing components
            if (refreshUserProfile) refreshUserProfile();
          }}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br bg-gray-900 from-gray-900 to-blue-800 p-4">
      {/* Notification Toast */}
      <div className={`fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${showNotification ? 'translate-x-0' : 'translate-x-full'}`}>
        ✅ {notificationMessage}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header Profile Section */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <img 
                src={userProfile?.photoURL || 'https://via.placeholder.com/128x128/9333ea/ffffff?text=User'} 
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-xl group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/128x128/9333ea/ffffff?text=User';
                }}
              />
              <button 
                onClick={handleAvatarUpload}
                className="absolute bottom-2 right-2 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {userProfile?.displayName}
              </h1>
              <p className="text-gray-600 text-lg mb-2">{userProfile?.email}</p>
              <p className="text-gray-500 mb-6">
                Tham gia: {userProfile && formatDate(userProfile.joinDate)}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  icon={BookOpen}
                  value={userProfile?.stats.storiesRead || 0}
                  label="Truyện đã đọc"
                  color="purple"
                />
                <StatsCard 
                  icon={Heart}
                  value={userProfile?.stats.favoriteCount || 0}
                  label="Yêu thích"
                  color="pink"
                />
                <StatsCard 
                  icon={Clock}
                  value={userProfile?.stats.readingTimeHours || 0}
                  label="Thời gian đọc"
                  color="blue"
                  suffix="h"
                />
                <StatsCard 
                  icon={Award}
                  value={userProfile?.stats.completedStories || 0}
                  label="Hoàn thành"
                  color="green"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto bg-gray-50 border-b">
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`px-8 py-4 font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'favorites' 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart size={20} />
              Yêu thích
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-8 py-4 font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'history' 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock size={20} />
              Lịch sử
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-8 py-4 font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'settings' 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings size={20} />
              Cài đặt
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Heart className="text-purple-500" size={28} />
                  Truyện yêu thích
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteStoriesWithProgress.map((story) => (
                    <div key={story._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border hover:border-purple-200">
                      <div className="aspect-w-3 aspect-h-4 relative overflow-hidden">
                        <img 
                          src={story.thumb_url || 'https://via.placeholder.com/300x400/6366f1/ffffff?text=No+Image'} 
                          alt={story.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=No+Image';
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm">
                          ⭐ {story.rating}
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            story.status === 'completed' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-blue-500 text-white'
                          }`}>
                            {story.status === 'completed' ? 'Hoàn thành' : 'Đang ra'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {story.name}
                        </h3>
                        <p className="text-gray-600 mb-3 text-sm">
                          {story.origin_name.join(', ')}
                        </p>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Tiến độ: {story.readChapters}/{story.totalChapters}</span>
                            <span>{story.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${story.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">
                              Đọc lần cuối: {story.lastRead.toLocaleDateString('vi-VN')}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium">
                              {story.category[0]?.name}
                            </span>
                          </div>
                        </div>
                        <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                          Tiếp tục đọc
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {favoriteStoriesWithProgress.length === 0 && (
                  <div className="text-center py-12">
                    <Heart className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 text-lg">Chưa có truyện yêu thích nào</p>
                    <p className="text-gray-400 text-sm mb-6">Hãy thêm những truyện bạn yêu thích để theo dõi dễ dàng hơn</p>
                    <button 
                      onClick={handleAddSampleData}
                      className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Thêm dữ liệu mẫu để test
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Clock className="text-blue-500" size={28} />
                  Lịch sử đọc
                </h2>
                <div className="space-y-4">
                  {readingHistoryWithProgress.map((story) => (
                    <div key={story._id} className="flex bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border hover:border-blue-200">
                      <img 
                        src={story.thumb_url || 'https://via.placeholder.com/96x128/3b82f6/ffffff?text=No+Image'}
                        alt={story.name}
                        className="w-24 h-32 object-cover flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/96x128/3b82f6/ffffff?text=No+Image';
                        }}
                      />
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors mb-1">
                              {story.name}
                            </h3>
                            <p className="text-gray-600 text-sm">{story.origin_name.join(', ')}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                              {story.category[0]?.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">{story.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Tiến độ: {story.readChapters}/{story.totalChapters}</span>
                            <span>{story.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${story.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">
                              Đọc lần cuối: {story.lastRead.toLocaleDateString('vi-VN')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-lg ${
                              story.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {story.status === 'completed' ? 'Hoàn thành' : 'Đang ra'}
                            </span>
                          </div>
                        </div>
                        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                          Tiếp tục đọc
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {readingHistoryWithProgress.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 text-lg">Chưa có lịch sử đọc</p>
                    <p className="text-gray-400 text-sm mb-6">Hãy bắt đầu đọc truyện để xem lịch sử ở đây</p>
                    <button 
                      onClick={handleAddSampleData}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Thêm dữ liệu mẫu để test
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Settings className="text-green-500" size={28} />
                  Cài đặt tài khoản
                </h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên hiển thị
                    </label>
                    <input 
                      type="text"
                      value={settings.displayName}
                      onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input 
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Tùy chọn</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Bell className="text-yellow-500" size={20} />
                        <span className="text-gray-700">Nhận thông báo</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications}
                          onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-blue-500" size={20} />
                        <span className="text-gray-700">Tự động đánh dấu</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.autoBookmark}
                          onChange={(e) => setSettings({...settings, autoBookmark: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={handleSaveSettings}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Lưu thay đổi
                    </button>
                    <button 
                      type="button"
                      className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-200"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </AuthRequired>
  );
};

export default UserProfilePage;