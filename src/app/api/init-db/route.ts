import { NextResponse } from 'next/server';
import { initializeFirebaseData } from '@/lib/init-firebase';

export async function POST() {
  try {
    await initializeFirebaseData();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}