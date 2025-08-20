import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const progressQuery = query(
      collection(db, 'readingProgress'),
      orderBy('lastRead', 'desc')
    );
    const progressSnapshot = await getDocs(progressQuery);
    
    const userMap = new Map();
    
    progressSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const userId = data.userId;
      
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: userId,
          name: `User ${userId.slice(0, 8)}`,
          email: `user${userId.slice(0, 4)}@example.com`,
          avatarUrl: 'https://placehold.co/100x100.png',
          joinedAt: data.lastRead?.toDate()?.toISOString().split('T')[0] || '2024-01-01',
          lastActive: data.lastRead?.toDate()?.toISOString().split('T')[0] || '2024-01-01',
          postsRead: 0
        });
      }
      
      userMap.get(userId).postsRead += 1;
    });
    
    const users = Array.from(userMap.values());
    
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ users: [] });
  }
}