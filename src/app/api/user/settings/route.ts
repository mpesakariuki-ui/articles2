import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const settingsRef = doc(db, 'userSettings', userId);
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      return NextResponse.json(settingsDoc.data());
    } else {
      // Return default settings
      return NextResponse.json({
        notifications: {
          email: true,
          comments: true,
          likes: false,
          newPosts: true
        },
        privacy: {
          profileVisible: true,
          showEmail: false,
          showReadingHistory: true
        },
        preferences: {
          theme: 'light',
          language: 'en',
          readingMode: 'comfortable',
          aiAssistance: true
        }
      });
    }
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, settings } = await request.json();

    if (!userId || !settings) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const settingsRef = doc(db, 'userSettings', userId);
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Create user preferences document for easy querying
    const preferencesRef = doc(db, 'userPreferences', userId);
    await setDoc(preferencesRef, {
      userId,
      theme: settings.preferences?.theme || 'light',
      language: settings.preferences?.language || 'en',
      aiAssistance: settings.preferences?.aiAssistance !== false,
      emailNotifications: settings.notifications?.email !== false,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving user settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}