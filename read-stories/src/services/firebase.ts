// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0F2YMRbusr3oGHPcSk2iV_VPfK4XtKR0",
  authDomain: "read-stories-bc546.firebaseapp.com",
  projectId: "read-stories-bc546",
  storageBucket: "read-stories-bc546.firebasestorage.app",
  messagingSenderId: "588151717260",
  appId: "1:588151717260:web:a63f91e202b9d5415a6aa9",
  measurementId: "G-MNYG3T2NYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();