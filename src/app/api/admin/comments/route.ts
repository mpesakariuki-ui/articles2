import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/firestore';

export async function GET() {
  try {
    const posts = await getPosts();
    const count = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
    
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}