import { NextResponse } from 'next/server';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  views?: number;
  comments?: Array<any>;
  [key: string]: any;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || 'week';

    // Get posts count
    const postsSnap = await getDocs(collection(db, 'posts'));
    const totalPosts = postsSnap.size;
    const totalViews = postsSnap.docs.reduce((sum, doc) => sum + (doc.data().views || 0), 0);
    const totalComments = postsSnap.docs.reduce((sum, doc) => sum + (doc.data().comments?.length || 0), 0);

    // Create analytics data from actual posts
    let analyticsData = {
      overview: {
        totalPosts,
        totalUsers: 0,
        totalViews,
        totalComments
      },
      userAnalytics: {
        timeRange: 'week',
        data: [],
        newUsers: 0,
        activeUsers: 0
      },
      contentAnalytics: {
        timeRange: 'week',
        data: [],
        topPosts: [],
        engagement: {
          totalViews,
          totalComments
        }
      }
    };

    // Use already fetched posts
    const posts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];

    // Update analytics data with latest information
    const analytics = {
      overview: analyticsData.overview,
      userAnalytics: {
        ...analyticsData.userAnalytics,
        timeRange
      },
      contentAnalytics: {
        timeRange,
        data: posts.map(post => ({
          date: post.createdAt,
          views: post.views || 0,
          comments: post.comments?.length || 0
        })),
        topPosts: posts
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map(post => ({
            id: post.id,
            title: post.title,
            views: post.views || 0,
            comments: post.comments?.length || 0
          })),
        engagement: {
          totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
          totalComments: posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)
        }
      }
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' }, 
      { status: 500 }
    );
  }
}