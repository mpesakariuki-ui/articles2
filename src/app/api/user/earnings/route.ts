import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/admin';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId || userId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 403 });
    }

    const earningsRef = adminDb.collection('users').doc(userId).collection('earnings');
    const querySnapshot = await earningsRef.get();
    
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