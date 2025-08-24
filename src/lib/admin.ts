import { getApps, cert, initializeApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize these as null initially
let _adminAuth: Auth | null = null;
let _adminDb: Firestore | null = null;

// Function to decode and parse service account
function getServiceAccount() {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required');
  }
  
  try {
    // Decode base64 encoded service account
    const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString();
    return JSON.parse(decodedKey);
  } catch (error) {
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format');
  }
}

// Function to initialize admin app
function initializeAdminApp() {
  const apps = getApps();
  
  if (!apps.length) {
    const serviceAccount = getServiceAccount();
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
}

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

// End of file
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