import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/admin';

export async function POST(request: NextRequest) {
  try {
    // Get the user by email
    const usersResult = await adminAuth.getUserByEmail('jamexkarix583@gmail.com');
    
    // Set admin custom claim
    await adminAuth.setCustomUserClaims(usersResult.uid, {
      admin: true
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return NextResponse.json({ error: 'Failed to set admin claim' }, { status: 500 });
  }
}
