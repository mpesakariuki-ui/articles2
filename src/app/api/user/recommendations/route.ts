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

    const recsRef = adminDb.collection('users').doc(userId).collection('recommendations');
    const querySnapshot = await recsRef.get();
    const recommendations = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}