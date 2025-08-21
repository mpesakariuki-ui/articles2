import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { price, paymentMethod } = await request.json();

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      paywall: {
        enabled: true,
        price: price,
        paymentMethod: paymentMethod || 'mpesa'
      },
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, paywall: { enabled: true, price } });
  } catch (error) {
    console.error('Error enabling paywall:', error);
    return NextResponse.json({ error: 'Failed to enable paywall' }, { status: 500 });
  }
}