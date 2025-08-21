import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const earningsQuery = query(
      collection(db, 'userEarnings'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(earningsQuery);
    
    if (querySnapshot.empty) {
      return NextResponse.json({ total: 0, available: 0, pending: 0 });
    }

    const earningsDoc = querySnapshot.docs[0].data();
    return NextResponse.json({
      total: earningsDoc.total || 0,
      available: earningsDoc.available || 0,
      pending: earningsDoc.pending || 0
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 });
  }
}