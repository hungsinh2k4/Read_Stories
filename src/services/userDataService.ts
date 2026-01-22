import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  limit,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  joinDate: Date;
  settings: {
    notifications: boolean;
    darkMode: boolean;
    autoBookmark: boolean;
  };
}

export interface ReadingProgress {
  id?: string;
  userId: string;
  storyId: string;
  storyName: string;
  storySlug: string;
  storyThumbnail: string;
  progress: number;
  readChapters: number;
  totalChapters: number;
  lastRead: Date;
  rating?: number;
  isFavorite: boolean;
  category: string;
}

export interface FavoriteStory {
  id?: string;
  userId: string;
  storyId: string;
  storyName: string;
  storySlug: string;
  storyThumbnail: string;
  addedAt: Date;
  category: string;
  status: string;
}

class UserDataService {
  // Tạo hoặc cập nhật profile người dùng
  async createOrUpdateUserProfile(userId: string, userData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      const existingUser = await getDoc(userRef);
      
      if (existingUser.exists()) {
        // Cập nhật user hiện có
        await updateDoc(userRef, {
          ...userData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Tạo user mới
        const newUser = {
          ...userData,
          joinDate: new Date(),
          stats: {
            storiesRead: 0,
            favoriteCount: 0,
            readingTimeHours: 0,
            completedStories: 0
          },
          settings: {
            notifications: true,
            darkMode: false,
            autoBookmark: true
          },
          vipStatus: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userRef, newUser);
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  }

  // Lấy profile người dùng
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          joinDate: data.joinDate?.toDate() || new Date()
        } as UserProfile;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      
      // Provide more specific error messages
      if (error?.code === 'permission-denied') {
        throw new Error('Không có quyền truy cập profile. Vui lòng kiểm tra Firebase Security Rules.');
      } else if (error?.code === 'unauthenticated') {
        throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        throw new Error('Không thể tải thông tin profile: ' + (error.message || 'Lỗi không xác định'));
      }
    }
  }

  // Cập nhật cài đặt người dùng
  async updateUserSettings(userId: string, settings: Partial<UserProfile['settings']>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        settings,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  // Thêm tiến độ đọc
  async addOrUpdateReadingProgress(progress: Omit<ReadingProgress, 'id'>): Promise<void> {
    try {
      // Kiểm tra xem đã có tiến độ cho story này chưa
      const progressQuery = query(
        collection(db, 'readingProgress'),
        where('userId', '==', progress.userId),
        where('storyId', '==', progress.storyId)
      );
      
      const existingProgress = await getDocs(progressQuery);
      
      if (!existingProgress.empty) {
        // Cập nhật tiến độ hiện có
        const docRef = existingProgress.docs[0].ref;
        await updateDoc(docRef, {
          ...progress,
          lastRead: new Date(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Tạo tiến độ mới
        await addDoc(collection(db, 'readingProgress'), {
          ...progress,
          lastRead: new Date(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Cập nhật stats của user
      await this.updateUserStats(progress.userId);
    } catch (error) {
      console.error('Error adding/updating reading progress:', error);
      throw error;
    }
  }

  // Lấy lịch sử đọc
  async getReadingHistory(userId: string, limitCount: number = 20): Promise<ReadingProgress[]> {
    try {
      // Sử dụng simple query luôn để tránh index issues
      const historyQuery = query(
        collection(db, 'readingProgress'),
        where('userId', '==', userId),
        limit(limitCount)
      );
      
      const historySnap = await getDocs(historyQuery);
      
      if (historySnap.empty) {
        return [];
      }

      const results = historySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastRead: doc.data().lastRead?.toDate() || new Date()
      })) as ReadingProgress[];
      
      // Sort manually in JavaScript (tránh cần index)
      return results.sort((a, b) => b.lastRead.getTime() - a.lastRead.getTime());
    } catch (error: any) {
      console.error('Error getting reading history:', error);
      
      // Nếu lỗi do missing index, return empty array với warning
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.warn('Missing Firestore index for reading history. Returning empty array.');
        return [];
      }
      
      throw new Error('Không thể tải lịch sử đọc: ' + (error.message || 'Lỗi không xác định'));
    }
  }

  // Thêm vào danh sách yêu thích
  async addToFavorites(favorite: Omit<FavoriteStory, 'id'>): Promise<void> {
    try {
      // Kiểm tra xem đã yêu thích chưa
      const favoriteQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', favorite.userId),
        where('storyId', '==', favorite.storyId)
      );
      
      const existingFavorite = await getDocs(favoriteQuery);
      
      if (existingFavorite.empty) {
        await addDoc(collection(db, 'favorites'), {
          ...favorite,
          addedAt: new Date(),
          createdAt: serverTimestamp()
        });

        // Cập nhật stats
        await this.updateUserStats(favorite.userId);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  // Xóa khỏi danh sách yêu thích
  async removeFromFavorites(userId: string, storyId: string): Promise<void> {
    try {
      const favoriteQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('storyId', '==', storyId)
      );
      
      const favoriteSnap = await getDocs(favoriteQuery);
      
      if (!favoriteSnap.empty) {
        await deleteDoc(favoriteSnap.docs[0].ref);
        
        // Cập nhật stats
        await this.updateUserStats(userId);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  // Lấy danh sách yêu thích
  async getFavoriteStories(userId: string): Promise<FavoriteStory[]> {
    try {
      // Sử dụng simple query luôn để tránh index issues
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );
      
      const favoritesSnap = await getDocs(favoritesQuery);
      
      if (favoritesSnap.empty) {
        return [];
      }

      const results = favoritesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        addedAt: doc.data().addedAt?.toDate() || new Date()
      })) as FavoriteStory[];
      
      // Sort manually in JavaScript (tránh cần index)
      return results.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
    } catch (error: any) {
      console.error('Error getting favorite stories:', error);
      
      // Nếu lỗi do missing index, return empty array với warning
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.warn('Missing Firestore index for favorites. Returning empty array.');
        return [];
      }
      
      throw new Error('Không thể tải danh sách yêu thích: ' + (error.message || 'Lỗi không xác định'));
    }
  }

  // Cập nhật thống kê người dùng
  private async updateUserStats(userId: string): Promise<void> {
    try {
      // Lấy số lượng truyện yêu thích
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );
      const favoritesSnap = await getDocs(favoritesQuery);
      const favoriteCount = favoritesSnap.size;

      // Lấy tiến độ đọc
      const progressQuery = query(
        collection(db, 'readingProgress'),
        where('userId', '==', userId)
      );
      const progressSnap = await getDocs(progressQuery);
      
      let storiesRead = 0;
      let completedStories = 0;
      let totalReadingTime = 0;

      progressSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.progress > 0) {
          storiesRead++;
        }
        if (data.progress === 100) {
          completedStories++;
        }
        // Giả định mỗi chapter đọc mất 10 phút
        totalReadingTime += (data.readChapters * 10) / 60; // convert to hours
      });

      // Cập nhật stats trong user profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        stats: {
          storiesRead,
          favoriteCount,
          readingTimeHours: Math.round(totalReadingTime),
          completedStories
        },
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // Cập nhật avatar
  async updateUserAvatar(userId: string, photoURL: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        photoURL,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user avatar:', error);
      throw error;
    }
  }
}

export const userDataService = new UserDataService();
