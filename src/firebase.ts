import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// Mock/Local Storage-backed Firestore Engine
// To completely avoid Firestore or Storage, we store and read all data from LocalStorage.
export const db = { _isMockFirestore: true };

// In-Memory listener store for real-time reactivity
type Listener = () => void;
const listeners: Record<string, Set<Listener>> = {};

function getCollectionData(collectionName: string): Record<string, any> {
  if (typeof window === "undefined" || !window.localStorage) return {};
  const value = window.localStorage.getItem(`fs_${collectionName}`);
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function setCollectionData(collectionName: string, data: Record<string, any>) {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(`fs_${collectionName}`, JSON.stringify(data));
  notifyListeners(collectionName);
}

function registerListener(collectionName: string, listener: Listener) {
  if (!listeners[collectionName]) {
    listeners[collectionName] = new Set();
  }
  listeners[collectionName].add(listener);
  return () => {
    listeners[collectionName].delete(listener);
  };
}

function notifyListeners(collectionName: string) {
  if (listeners[collectionName]) {
    listeners[collectionName].forEach(listener => {
      try {
        listener();
      } catch (err) {
        console.error("Firestore mock listener notification error:", err);
      }
    });
  }
}

export function collection(database: any, collectionName: string) {
  return { type: "collection", name: collectionName };
}

export function doc(...args: any[]) {
  let collectionName: string;
  let docId: string;
  if (args[0] && args[0].type === "collection") {
    collectionName = args[0].name;
    docId = args[1];
  } else {
    collectionName = args[1];
    docId = args[2];
  }
  return { type: "doc", collection: collectionName, id: docId };
}

export function query(collectionRef: any, ...constraints: any[]) {
  return {
    type: "query",
    collection: collectionRef.name,
    constraints
  };
}

export function where(field: string, op: string, value: any) {
  return { type: "where", field, op, value };
}

class MockDocSnap {
  constructor(public id: string, private dataValue: any) {}
  exists() {
    return this.dataValue !== undefined && this.dataValue !== null;
  }
  data() {
    return this.dataValue;
  }
}

class MockQuerySnapshot {
  docs: MockDocSnap[] = [];
  get empty() {
    return this.docs.length === 0;
  }
  get size() {
    return this.docs.length;
  }
  forEach(callback: (doc: MockDocSnap) => void) {
    this.docs.forEach(callback);
  }
}

export async function getDocs(ref: any) {
  const collectionName = ref.type === "query" ? ref.collection : ref.name;
  const allDocs = getCollectionData(collectionName);
  const snap = new MockQuerySnapshot();
  
  Object.entries(allDocs).forEach(([id, data]) => {
    snap.docs.push(new MockDocSnap(id, data));
  });

  if (ref.type === "query") {
    ref.constraints.forEach((constraint: any) => {
      if (constraint && constraint.type === "where") {
        const { field, op, value } = constraint;
        snap.docs = snap.docs.filter(docSnap => {
          const docData = docSnap.data();
          const fieldValue = docData ? docData[field] : undefined;
          if (op === "==") {
            return fieldValue === value;
          }
          return true;
        });
      }
    });
  }

  return snap;
}

export async function getDoc(docRef: any) {
  const allDocs = getCollectionData(docRef.collection);
  const data = allDocs[docRef.id];
  return new MockDocSnap(docRef.id, data);
}

export async function setDoc(docRef: any, data: any, options?: any) {
  const allDocs = getCollectionData(docRef.collection);
  if (options && options.merge && allDocs[docRef.id]) {
    allDocs[docRef.id] = { ...allDocs[docRef.id], ...data };
  } else {
    allDocs[docRef.id] = data;
  }
  setCollectionData(docRef.collection, allDocs);
}

export async function updateDoc(docRef: any, data: any) {
  const allDocs = getCollectionData(docRef.collection);
  if (allDocs[docRef.id]) {
    allDocs[docRef.id] = { ...allDocs[docRef.id], ...data };
    setCollectionData(docRef.collection, allDocs);
  }
}

export async function deleteDoc(docRef: any) {
  const allDocs = getCollectionData(docRef.collection);
  delete allDocs[docRef.id];
  setCollectionData(docRef.collection, allDocs);
}

export function onSnapshot(ref: any, onNext: any, onError?: any) {
  const collectionName = ref.type === "doc" ? ref.collection : (ref.type === "query" ? ref.collection : ref.name);
  
  const callback = async () => {
    try {
      if (ref.type === "doc") {
        const docSnap = await getDoc(ref);
        onNext(docSnap);
      } else {
        const querySnap = await getDocs(ref);
        onNext(querySnap);
      }
    } catch (e) {
      if (onError) onError(e);
      else console.error("Error in simulated onSnapshot update:", e);
    }
  };

  callback(); // Initial snapshot trigger
  return registerListener(collectionName, callback);
}
