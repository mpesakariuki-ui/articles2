import { getApps, cert, initializeApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize these as null initially
let _adminAuth: Auth | null = null;
let _adminDb: Firestore | null = null;

// Function to get initialized auth instance
export function getAdminAuth(): Auth {
  if (typeof window !== 'undefined') {
    throw new Error('Admin SDK should only be used on the server side');
  }

  if (!_adminAuth) {
    initializeAdminApp();
    _adminAuth = getAuth();
  }
  return _adminAuth;
}

// Function to get initialized firestore instance
export function getAdminDb(): Firestore {
  if (typeof window !== 'undefined') {
    throw new Error('Admin SDK should only be used on the server side');
  }

  if (!_adminDb) {
    initializeAdminApp();
    _adminDb = getFirestore();
  }
  return _adminDb;
}

// Helper to initialize the app if needed
function initializeAdminApp() {
  if (!getApps().length) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required');
    }

    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      projectId: 'last-35eb7'
    });
  }
}

// For backwards compatibility with existing code
export const adminAuth = getAdminAuth();
export const adminDb = getAdminDb();

export function checkAdminAccess(email: string | null | undefined): boolean {
  return email === 'jamexkarix583@gmail.com';
}