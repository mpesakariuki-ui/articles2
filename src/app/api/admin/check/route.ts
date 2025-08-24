import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/admin';
import { headers } from 'next/headers';

const ADMIN_EMAIL = 'jamexkarix583@gmail.com';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userEmail = decodedToken.email;

    if (!userEmail) {
      return NextResponse.json({ isAdmin: false });
    }

    const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    return NextResponse.json({ isAdmin });

  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
