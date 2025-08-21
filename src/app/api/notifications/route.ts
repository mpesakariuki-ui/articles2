import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const querySnapshot = await getDocs(notificationsQuery);
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json(notifications);
    } catch (queryError) {
      // If collection doesn't exist or orderBy fails, return empty array
      console.log('Notifications collection empty or index missing, returning empty array');
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, message, postId, fromUserId } = await request.json();

    if (!userId || !type || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notification = {
      userId,
      type,
      message,
      postId: postId || null,
      fromUserId: fromUserId || null,
      read: false,
      createdAt: new Date().toISOString()
    };

    const { addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'notifications'), notification);

    return NextResponse.json({ id: docRef.id, ...notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}