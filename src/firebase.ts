import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBASd1PrhJExC0qjpqujxGu8DrvImIa2lI",
  authDomain: "lms-aramaic.firebaseapp.com",
  projectId: "lms-aramaic",
  storageBucket: "lms-aramaic.firebasestorage.app",
  messagingSenderId: "407664946170",
  appId: "1:407664946170:web:894bb14cc2f9abe4f9d243"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

