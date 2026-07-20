import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { userDataService, type UserProfile } from "../services/userDataService";

interface AuthContextProps {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  logout: async () => { },
  refreshUserProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Lấy hoặc tạo user profile
          let profile = await userDataService.getUserProfile(firebaseUser.uid);

          if (!profile) {
            // Tạo profile mới nếu chưa có
            await userDataService.createOrUpdateUserProfile(firebaseUser.uid, {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Người dùng',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || ''
            });
            profile = await userDataService.getUserProfile(firebaseUser.uid);
          }

          setUserProfile(profile);
          setError(null);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
        setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi đăng xuất');
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return;
    try {
      const profile = await userDataService.getUserProfile(user.uid);
      setUserProfile(profile);
      setError(null);
    } catch (err) {
      console.error("Error refreshing user profile:", err);
      setError(err instanceof Error ? err.message : 'Đã có lỗi khi tải thông tin người dùng');
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, error, logout, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
