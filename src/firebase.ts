import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// User's custom Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBASd1PrhJExC0qjpqujxGu8DrvImIa2lI",
  authDomain: "lms-aramaic.firebaseapp.com",
  projectId: "lms-aramaic",
  storageBucket: "lms-aramaic.firebasestorage.app",
  messagingSenderId: "407664946170",
  appId: "1:407664946170:web:894bb14cc2f9abe4f9d243"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Real Firebase Authentication
export const auth = getAuth(app);

// Real Firestore Database Connection (using default database for the custom project)
export const db = getFirestore(app);

// Re-export real Firestore SDK methods to seamlessly match existing codebase usages
export {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
