import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('postId', '==', id)
    );
    
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        postId: data.postId,
        text: data.text,
        author: data.author || { name: 'Anonymous', avatarUrl: '' },
        createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
      };
    });
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { text, userId, userName, userEmail, userAvatar } = await request.json();
    
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 });
    }
    
    const commentData = {
      postId: id,
      text: text.trim(),
      author: {
        id: userId,
        name: userName || 'Anonymous',
        email: userEmail || '',
        avatarUrl: userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'Anonymous')}&background=random`
      },
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'comments'), commentData);
    
    const comment = {
      id: docRef.id,
      ...commentData,
      createdAt: new Date().toLocaleDateString()
    };
    
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ 
      error: 'Failed to post comment', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}