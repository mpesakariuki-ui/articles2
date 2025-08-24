import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const authorId = url.searchParams.get('authorId');

    if (!userId || !authorId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const followId = `${userId}_${authorId}`;
    const followDoc = await adminDb.collection('follows').doc(followId).get();

    return NextResponse.json({ isFollowing: followDoc.exists });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json({ isFollowing: false });
  }
}