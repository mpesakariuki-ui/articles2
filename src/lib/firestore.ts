import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc,
  arrayUnion,
  query,
  where,
  Firestore,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post } from './types';
import { dataCache } from './cache';

// Type assertion for Firestore database
const database = db as Firestore;

// Posts
export const getPosts = async (): Promise<Post[]> => {
  try {
    // Check cache first
    const cachedPosts = dataCache.get<Post[]>('posts');
    if (cachedPosts) {
      console.log('Returning cached posts');
      return cachedPosts;
    }
    
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
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Cache the posts for 5 minutes
    dataCache.set('posts', posts, 5);
    console.log('Fetched and cached posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getPost = async (id: string): Promise<Post | null> => {
  try {
    // Check cache first
    const cachedPost = dataCache.get<Post>(`post_${id}`);
    if (cachedPost) {
      console.log('Returning cached post:', id);
      return cachedPost;
    }
    
    const docRef = doc(database, 'posts', id);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    const post = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      views: typeof data.views === 'number' ? data.views : 0,
      comments: Array.isArray(data.comments) ? data.comments : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: data.category || 'Uncategorized',
      author: data.author || { id: '1', name: 'Anonymous', avatarUrl: '' }
    } as Post;
    
    // Cache the post for 10 minutes
    dataCache.set(`post_${id}`, post, 10);
    return post;
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

// Admin Functions
export const getAdminStats = async () => {
  try {
    const [posts, users, admins] = await Promise.all([
      getDocs(collection(db, 'posts')),
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'admins'))
    ]);

    const totalViews = posts.docs.reduce((sum, post) => sum + (post.data().views || 0), 0);
    const totalComments = posts.docs.reduce((sum, post) => sum + (post.data().comments?.length || 0), 0);

    return {
      totalPosts: posts.size,
      totalUsers: users.size,
      totalAdmins: admins.size,
      totalViews,
      totalComments
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw error;
  }
};

export const getUserAnalytics = async (timeRange: 'day' | 'week' | 'month' = 'week') => {
  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
  }

  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', now)
    );

    const users = await getDocs(usersQuery);
    return users.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
};

export const getContentAnalytics = async (timeRange: 'day' | 'week' | 'month' = 'week') => {
  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
  }

  try {
    const postsQuery = query(
      collection(db, 'posts'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', now)
    );

    const posts = await getDocs(postsQuery);
    return posts.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting content analytics:', error);
    throw error;
  }
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

export const updatePost = async (id: string, updates: Partial<Post>): Promise<void> => {
  try {
    const postRef = doc(database, 'posts', id);
    await updateDoc(postRef, updates);
    console.log('Post updated successfully:', id);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    const postRef = doc(database, 'posts', id);
    await deleteDoc(postRef);
    console.log('Post deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};