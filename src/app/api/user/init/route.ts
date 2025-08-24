import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/admin';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from header
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Initialize user document and collections
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      // Create main user document
      await userRef.set({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Initialize earnings subcollection
      await userRef.collection('earnings').doc('default').set({
        total: 0,
        available: 0,
        pending: 0,
        totalWithdrawn: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Initialize preferences
      await userRef.collection('preferences').doc('default').set({
        interests: [],
        readingLevel: 'intermediate',
        preferredCategories: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Initialize settings
      await userRef.collection('settings').doc('default').set({
        notifications: {
          email: true,
          push: true,
          comments: true,
          likes: true,
          mentions: true
        },
        privacy: {
          profileVisible: true,
          showEmail: false,
          showActivity: true
        },
        theme: 'light',
        language: 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Initialize user reading history if not exists
    const historyRef = adminDb.collection('userReadingHistory').doc(userId);
    const historyDoc = await historyRef.get();
    if (!historyDoc.exists) {
      await historyRef.set({
        posts: [],
        lastRead: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User collections initialized'
    });
  } catch (error) {
    console.error('Error initializing user collections:', error);
    return NextResponse.json(
      { error: 'Failed to initialize user collections' },
      { status: 500 }
    );
  }
}
