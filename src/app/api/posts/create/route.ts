import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt, category, tags, author } = await request.json();

    if (!title || !content || !category || !author?.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postData = {
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      author: {
        name: author.name || 'Anonymous',
        email: author.email,
        avatarUrl: author.avatarUrl || 'https://placehold.co/100x100.png'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: [],
      coverImage: 'https://placehold.co/800x400.png',
      recommendedBooks: [],
      lectures: [],
      references: [],
      status: 'published'
    };

    const docRef = await addDoc(collection(db, 'posts'), postData);
    
    // Clear cache
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts/cache`, { 
      method: 'DELETE' 
    });

    return NextResponse.json({ 
      success: true, 
      postId: docRef.id,
      message: 'Post created successfully' 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}