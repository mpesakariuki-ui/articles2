import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k",
  authDomain: "last-35eb7.firebaseapp.com",
  projectId: "last-35eb7",
  storageBucket: "last-35eb7.firebasestorage.app",
  messagingSenderId: "760347188535",
  appId: "1:760347188535:web:ee68b7dc9606e6aa430eb2",
  measurementId: "G-9FKT8T77PG"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');

  // Initialize Auth
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');

  // Initialize Firestore
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase services:', error);
  throw error;
}

export { auth, db };