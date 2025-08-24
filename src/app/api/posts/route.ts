import { NextRequest, NextResponse } from 'next/server';
import { dataCache } from '@/lib/cache';
import type { Book, Lecture, Post, User } from '@/lib/types';
import { headers } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/admin';

interface CreatePostBody {
  title: string;
  content: string;
  description?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  subtopic?: string;
  bookRecommendations?: string;
  lectures?: string;
  references?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from header
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    console.log('Authorization header:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    console.log('Token:', token);
    
    // Verify and decode token
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('Decoded token:', decodedToken);
    console.log('Admin claim:', decodedToken.admin);
    console.log('Email:', decodedToken.email);
    
    // Check if user has admin email
    if (decodedToken.email !== 'jamexkarix583@gmail.com') {
      console.log('User is not an admin');
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Get user data
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    console.log('User data:', userData);
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json() as CreatePostBody;
    const { title, content, description, category, tags, coverImage, subtopic, bookRecommendations, lectures, references } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newPost = {
      title,
      content: content + (subtopic ? `\n\n## ${subtopic}` : ''),
      category: category || 'General',
      tags: tags || [],
      excerpt: description || content.substring(0, 150) + (content.length > 150 ? '...' : ''),
      author: {
        id: decodedToken.uid,
        name: userData.displayName || decodedToken.name || 'Anonymous',
        avatarUrl: userData.photoURL || 'https://placehold.co/100x100.png',
        email: decodedToken.email || 'anonymous@example.com' // Fallback email to satisfy type
      },
      createdAt: new Date().toISOString(),
      comments: [],
      recommendedBooks: bookRecommendations ? bookRecommendations.split('\n').filter(Boolean).map((book: string, i: number) => ({
        id: `book-${i}`,
        title: book.split(' by ')[0] || book,
        author: book.split(' by ')[1] || 'Unknown',
        imageUrl: 'https://placehold.co/300x400.png'
      })) : [],
      lectures: lectures ? lectures.split('\n').filter(Boolean).map((lecture: string, i: number) => ({
        id: `lecture-${i}`,
        title: lecture.split(' - ')[0] || lecture,
        type: 'video' as const,
        embedUrl: lecture.includes('http') ? lecture.split(' - ')[1] || '#' : '#',
        thumbnailUrl: 'https://placehold.co/400x225.png'
      })) : [],
      references: references ? references.split('\n').filter(Boolean) : [],
      coverImage: coverImage || 'https://placehold.co/1200x630.png',
      views: 0,
    };

    const postRef = await adminDb.collection('posts').add(newPost);
    const postId = postRef.id;
    
    // Clear posts cache when new post is added
    dataCache.clear();
    
    return NextResponse.json({ success: true, post: { id: postId, ...newPost } });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const cachedPosts = dataCache.get('posts');
    if (cachedPosts) {
      return NextResponse.json({ posts: cachedPosts });
    }

    // Fetch from database if not cached
    const querySnapshot = await adminDb.collection('posts').get();
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (!Array.isArray(posts)) {
      console.error('Posts is not an array:', posts);
      return NextResponse.json({ posts: [] });
    }
    
    // Cache for 5 minutes
    dataCache.set('posts', posts, 5);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json({ posts: [], error: 'Failed to fetch posts' }, { status: 500 });
  }
}