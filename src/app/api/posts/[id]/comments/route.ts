import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/lib/firestore';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await getPost(id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ comments: post.comments || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { text } = await request.json();
    
    const post = await getPost(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const newComment = {
      id: String(Date.now()),
      text,
      author: {
        id: 'anonymous',
        name: 'Anonymous User',
        avatarUrl: 'https://placehold.co/100x100.png'
      },
      createdAt: 'Just now'
    };

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}