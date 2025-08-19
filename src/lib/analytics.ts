import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface ReadingStats {
  totalArticlesRead: number;
  totalReadingTime: number;
  favoriteCategories: string[];
  readingStreak: number;
  completionRate: number;
}

export async function getUserReadingStats(userId: string): Promise<ReadingStats> {
  try {
    const progressQuery = query(
      collection(db, 'readingProgress'),
      where('userId', '==', userId),
      orderBy('lastRead', 'desc')
    );
    
    const snapshot = await getDocs(progressQuery);
    const progressData = snapshot.docs.map(doc => doc.data());
    
    const totalArticlesRead = progressData.filter(p => p.progress > 80).length;
    const totalReadingTime = progressData.reduce((sum, p) => sum + (p.readingTime || 0), 0);
    const completionRate = progressData.length > 0 ? (totalArticlesRead / progressData.length) * 100 : 0;
    
    // Get favorite categories from posts
    const postsQuery = query(collection(db, 'posts'));
    const postsSnapshot = await getDocs(postsQuery);
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const readPostIds = progressData.filter(p => p.progress > 50).map(p => p.postId);
    const readPosts = posts.filter(post => readPostIds.includes(post.id));
    const categoryCount = readPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
    
    return {
      totalArticlesRead,
      totalReadingTime,
      favoriteCategories,
      readingStreak: calculateReadingStreak(progressData),
      completionRate: Math.round(completionRate)
    };
  } catch (error) {
    console.error('Error fetching reading stats:', error);
    return {
      totalArticlesRead: 0,
      totalReadingTime: 0,
      favoriteCategories: [],
      readingStreak: 0,
      completionRate: 0
    };
  }
}

function calculateReadingStreak(progressData: any[]): number {
  if (progressData.length === 0) return 0;
  
  const sortedDates = progressData
    .map(p => new Date(p.lastRead.toDate()).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  const today = new Date().toDateString();
  
  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (sortedDates[i] === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}