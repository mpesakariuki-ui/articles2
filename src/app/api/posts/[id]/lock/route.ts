import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { locked } = await request.json();

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      locked: locked,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, locked });
  } catch (error) {
    console.error('Error updating post lock:', error);
    return NextResponse.json({ error: 'Failed to update post lock' }, { status: 500 });
  }
}