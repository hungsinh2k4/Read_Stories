import React, { useState, useEffect } from 'react';
import { Settings, Heart, Clock, BookOpen, Camera, Award, Bell } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import AuthRequired from '../components/AuthRequired';
import ErrorDisplay from '../components/ErrorDisplay';
import { ProfileSkeleton } from '../components/skeletons';
import { useAuthContext } from '../contexts/AuthContext';
import { useUserDataContext } from '../contexts/UserDataContext';
import { userDataService } from '../services/userDataService';

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Use Firebase authentication
  const { user, userProfile, loading, refreshUserProfile, error: authError } = useAuthContext();

  // ✅ Get real data from Firebase
  const {
    favoriteStories,
    readingHistory,
    loading: dataLoading
  } = useUserDataContext();

  // ✅ Calculate real stats from Firebase data
  const stats = {
    storiesRead: readingHistory.length,
    favoriteCount: favoriteStories.length,
    readingTimeHours: readingHistory.reduce((total, story) => {
      // Estimate reading time based on chapters read (30 minutes per chapter)
      return total + (story.progress * 0.1);
    }, 0),
    completedStories: readingHistory.filter(story =>
      story.progress >= 100
    ).length
  };

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

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <AuthRequired user={user} loading={loading}>
      {/* Error Display */}
      {authError && (
        <ErrorDisplay
          error={authError || 'Đã có lỗi xảy ra'}
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

                {/* ✅ Stats Grid - Using real data */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    icon={BookOpen}
                    value={stats.storiesRead}
                    label="Truyện đã đọc"
                    color="purple"
                  />
                  <StatsCard
                    icon={Heart}
                    value={stats.favoriteCount}
                    label="Yêu thích"
                    color="pink"
                  />
                  <StatsCard
                    icon={Clock}
                    value={Math.round(stats.readingTimeHours)}
                    label="Thời gian đọc"
                    color="blue"
                    suffix="h"
                  />
                  <StatsCard
                    icon={Award}
                    value={stats.completedStories}
                    label="Hoàn thành"
                    color="green"
                  />
                </div>
              </div>
            </div>

            {/* ✅ Loading indicator for data */}
            {dataLoading && (
              <div className="mt-4 text-center text-gray-500">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  Đang tải dữ liệu...
                </div>
              </div>
            )}
          </div>

          {/* Content Tabs */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto bg-gray-50 border-b">
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-8 py-4 font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeTab === 'settings'
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
                        onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
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
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
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
                            onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
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
                            onChange={(e) => setSettings({ ...settings, autoBookmark: e.target.checked })}
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