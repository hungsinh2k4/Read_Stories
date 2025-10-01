// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//import.meta.env.VITE_FIREBASE_API_KEY
const firebaseConfig = {
  apiKey: 'AIzaSyD0F2YMRbusr3oGHPcSk2iV_VPfK4XtKR0',
  authDomain: 'read-stories-bc546.firebaseapp.com',
  projectId: 'read-stories-bc546',
  storageBucket: 'read-stories-bc546.firebasestorage.app',
  messagingSenderId: '588151717260',
  appId: '1:588151717260:web:a63f91e202b9d5415a6aa9',
  measurementId: 'G-MNYG3T2NYN'
  
};

const app = initializeApp(firebaseConfig);
// console.log("Firebase initialized with config:", firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
