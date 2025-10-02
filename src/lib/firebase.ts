import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase web configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDhA0r0URHhPbGicpiBJo27WIQOZg49cCM",
  authDomain: "sales-insights-k5dhc.firebaseapp.com",
  projectId: "sales-insights-k5dhc",
  storageBucket: "sales-insights-k5dhc.firebasestorage.app",
  messagingSenderId: "699253426756",
  appId: "1:699253426756:web:4d6f41ca6f686640144a11",
};

export const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


