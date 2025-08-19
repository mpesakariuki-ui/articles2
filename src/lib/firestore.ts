import { collection, doc, getDocs, getDoc, addDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Post } from './types';

// Posts
export const getPosts = async (): Promise<Post[]> => {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};

export const getPost = async (id: string): Promise<Post | null> => {
  const docRef = doc(db, 'posts', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Post : null;
};

export const addPost = async (post: Omit<Post, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'posts'), post);
  return docRef.id;
};

// Reading Progress
export const saveReadingProgress = async (userId: string, postId: string, progress: number) => {
  await setDoc(doc(db, 'readingProgress', `${userId}_${postId}`), {
    userId,
    postId,
    progress,
    lastRead: new Date(),
  });
};

export const getReadingProgress = async (userId: string, postId: string): Promise<number> => {
  const docRef = doc(db, 'readingProgress', `${userId}_${postId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().progress : 0;
};

export const getLastReadPost = async (userId: string): Promise<string | null> => {
  const querySnapshot = await getDocs(collection(db, 'readingProgress'));
  const userProgress = querySnapshot.docs
    .filter(doc => doc.data().userId === userId)
    .sort((a, b) => b.data().lastRead.toDate() - a.data().lastRead.toDate());
  
  return userProgress.length > 0 ? userProgress[0].data().postId : null;
};