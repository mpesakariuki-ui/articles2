import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/store';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = await Promise.resolve(params.id);
    await incrementViews(postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}