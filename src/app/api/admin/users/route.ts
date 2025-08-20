import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    // Get reading progress entries to estimate active users
    const progressSnapshot = await getDocs(collection(db, 'readingProgress'));
    const uniqueUsers = new Set();
    
    progressSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.userId) {
        uniqueUsers.add(data.userId);
      }
    });
    
    return NextResponse.json({ count: uniqueUsers.size });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}