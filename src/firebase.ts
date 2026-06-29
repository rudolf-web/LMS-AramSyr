import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// User's custom Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTm9Co7fmX1BIGNxyjuGHYruLkJxC1Bgo",
  authDomain: "aqueous-magnet-zv8b6.firebaseapp.com",
  projectId: "aqueous-magnet-zv8b6",
  storageBucket: "aqueous-magnet-zv8b6.firebasestorage.app",
  messagingSenderId: "931754280246",
  appId: "1:931754280246:web:0cdd5b8e5eb7deacc81f97"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Real Firebase Authentication
export const auth = getAuth(app);

// Real Firestore Database Connection using provisioned database ID
export const db = getFirestore(app, "ai-studio-lmsbahasaaramaik-bd95a0e9-3234-403f-8ae9-74995acdfa47");

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
