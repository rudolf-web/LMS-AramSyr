import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration from our auto-provisioned setup
const firebaseConfig = {
  projectId: "aqueous-magnet-zv8b6",
  appId: "1:931754280246:web:0cdd5b8e5eb7deacc81f97",
  apiKey: "AIzaSyCTm9Co7fmX1BIGNxyjuGHYruLkJxC1Bgo",
  authDomain: "aqueous-magnet-zv8b6.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-bd95a0e9-3234-403f-8ae9-74995acdfa47",
  storageBucket: "aqueous-magnet-zv8b6.firebasestorage.app",
  messagingSenderId: "931754280246"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
