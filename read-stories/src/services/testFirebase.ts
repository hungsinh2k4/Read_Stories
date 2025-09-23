// Test Firebase connection và setup
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase connection...');
  
  // Test Auth
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 Auth state:', user ? `Logged in as ${user.email}` : 'Not logged in');
      
      if (user) {
        try {
          // Test Firestore read
          console.log('📖 Testing Firestore read...');
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            console.log('✅ Successfully read user profile:', userDoc.data());
          } else {
            console.log('⚠️  User profile does not exist, creating...');
            
            // Test Firestore write
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName || 'Test User',
              email: user.email,
              photoURL: user.photoURL,
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
              vipStatus: false
            });
            
            console.log('✅ Successfully created user profile');
          }
          
          resolve({ success: true, user });
        } catch (error: any) {
          console.error('❌ Firestore error:', error);
          
          if (error.code === 'permission-denied') {
            console.log('🔒 Permission denied - Security Rules need to be updated');
            console.log('📋 Check FIREBASE_SETUP.md for proper Security Rules');
          }
          
          resolve({ success: false, error: error.message, user });
        }
      } else {
        console.log('⚠️  Please login to test Firestore');
        resolve({ success: false, error: 'Not authenticated', user: null });
      }
      
      unsubscribe();
    });
  });
};
