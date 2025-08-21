import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { userId, authorId, action } = await request.json();

    if (!userId || !authorId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const followId = `${userId}_${authorId}`;

    if (action === 'follow') {
      await setDoc(doc(db, 'follows', followId), {
        userId,
        authorId,
        createdAt: new Date().toISOString()
      });
    } else if (action === 'unfollow') {
      await deleteDoc(doc(db, 'follows', followId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating follow status:', error);
    return NextResponse.json({ error: 'Failed to update follow status' }, { status: 500 });
  }
}