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
    let parsedKey;
    
    // First try to parse it directly in case it's a JSON string
    try {
      parsedKey = JSON.parse(serviceAccountKey);
      if (isValidServiceAccount(parsedKey)) {
        return parsedKey;
      }
    } catch (e) {
      // Not a JSON string, continue to try base64
    }
    
    // Try to decode as base64
    try {
      const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString();
      parsedKey = JSON.parse(decodedKey);
      if (isValidServiceAccount(parsedKey)) {
        return parsedKey;
      }
    } catch (e) {
      // Not valid base64 or JSON
    }
    
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format');
  } catch (error) {
    console.error('Firebase Service Account Error:', error);
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format');
  }
}

// Helper function to validate service account object
function isValidServiceAccount(obj: any): boolean {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.type === 'string' &&
    obj.type === 'service_account' &&
    typeof obj.project_id === 'string' &&
    typeof obj.private_key_id === 'string' &&
    typeof obj.private_key === 'string' &&
    typeof obj.client_email === 'string'
  );
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
export const adminAuth = getAdminAuth();
export const adminDb = getAdminDb();

export function checkAdminAccess(email: string | null | undefined): boolean {
  return email === 'jamexkarix583@gmail.com';
}