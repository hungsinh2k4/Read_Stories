import { useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { userDataService, type UserProfile } from '../services/userDataService';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export interface AuthState {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Lấy hoặc tạo user profile
          let userProfile = await userDataService.getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            // Tạo profile mới nếu chưa có
            await userDataService.createOrUpdateUserProfile(firebaseUser.uid, {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Người dùng',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || ''
            });
            
            // Lấy lại profile vừa tạo
            userProfile = await userDataService.getUserProfile(firebaseUser.uid);
          }

          setAuthState({
            user: firebaseUser,
            userProfile,
            loading: false,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            userProfile: null,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi đăng xuất'
      }));
    }
  };

  const refreshUserProfile = async () => {
    if (!authState.user) return;

    try {
      const userProfile = await userDataService.getUserProfile(authState.user.uid);
      setAuthState(prev => ({
        ...prev,
        userProfile,
        error: null
      }));
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Đã có lỗi khi tải thông tin người dùng'
      }));
    }
  };

  return {
    ...authState,
    logout,
    refreshUserProfile
  };
};
