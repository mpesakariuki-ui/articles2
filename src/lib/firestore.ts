import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  arrayUnion,
  Firestore,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post } from './types';

// Type assertion for Firestore database
const database = db as Firestore;

// Posts
export const getPosts = async (): Promise<Post[]> => {
  try {
    console.log('Fetching posts from Firestore');
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(database, 'posts'));
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        views: typeof data.views === 'number' ? data.views : 0,
        comments: Array.isArray(data.comments) ? data.comments : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        category: data.category || 'Uncategorized',
        author: data.author || { id: '1', name: 'Anonymous', avatarUrl: '' }
      } as Post;
    });
    console.log('Fetched posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getPost = async (id: string): Promise<Post | null> => {
  try {
    const docRef = doc(database, 'posts', id);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      views: typeof data.views === 'number' ? data.views : 0,
      comments: Array.isArray(data.comments) ? data.comments : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: data.category || 'Uncategorized',
      author: data.author || { id: '1', name: 'Anonymous', avatarUrl: '' }
    } as Post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

export const addPost = async (post: Omit<Post, 'id'>): Promise<string> => {
  try {
    console.log('Adding post to Firestore:', post);
    const postData = {
      ...post,
      createdAt: new Date().toISOString(),
      views: 0,
      comments: [],
      tags: Array.isArray(post.tags) ? post.tags : [],
      category: post.category || 'Uncategorized',
      author: post.author || { id: '1', name: 'Anonymous', avatarUrl: '' }
    };
    const docRef = await addDoc(collection(database, 'posts'), postData);
    console.log('Post added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding post to Firestore:', error);
    throw error;
  }
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

// Comments
export const getComments = async (postId: string) => {
  try {
    const docRef = doc(database, 'posts', postId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return [];
    return docSnap.data().comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const addComment = async (postId: string, commentData: { text: string; author: { id: string; name: string; avatarUrl: string } }) => {
  try {
    const postRef = doc(database, 'posts', postId);
    const comment = {
      id: `comment_${Date.now()}`,
      text: commentData.text,
      author: commentData.author,
      createdAt: new Date().toISOString(),
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
    
    return comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};