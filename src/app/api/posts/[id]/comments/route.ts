import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/lib/store';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { text, author } = await request.json();
    
    const post = posts.find(p => p.id === id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const newComment = {
      id: String(Date.now()),
      text,
      author: author || {
        id: 'anonymous',
        name: 'Anonymous User',
        avatarUrl: 'https://placehold.co/100x100.png'
      },
      createdAt: 'Just now'
    };

    post.comments.push(newComment);
    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}