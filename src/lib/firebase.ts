import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase web configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyCekEPTDqAdasJV8D1kL6SvGuGlFJSA_VE",
  authDomain: "studio-7088434206-b7e16.firebaseapp.com",
  projectId: "studio-7088434206-b7e16",
  storageBucket: "studio-7088434206-b7e16.firebasestorage.app",
  messagingSenderId: "302376318165",
  appId: "1:302376318165:web:0cfcb88347eed5ff4a9e5c",
};

export const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


