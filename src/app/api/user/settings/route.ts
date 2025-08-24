import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    console.log('GET settings for userId:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const settingsRef = doc(db, 'userSettings', userId);
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      console.log('Found existing settings');
      return NextResponse.json(settingsDoc.data());
    } else {
      console.log('No settings found, returning defaults');
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
        },
        aiModel: {
          provider: 'deepseek',
          model: 'deepseek-chat',
          apiKey: '',
          enabled: false
        }
      });
    }
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received settings data:', body);
    
    const { userId, settings } = body;

    if (!userId || !settings) {
      console.error('Missing fields - userId:', userId, 'settings:', settings);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Saving settings for user:', userId);
    
    const settingsRef = doc(db, 'userSettings', userId);
    const settingsData = {
      notifications: settings.notifications || {},
      privacy: settings.privacy || {},
      preferences: settings.preferences || {},
      aiModel: settings.aiModel || {},
      updatedAt: new Date().toISOString()
    };
    
    console.log('Settings data to save:', settingsData);
    await setDoc(settingsRef, settingsData, { merge: true });

    console.log('Settings saved successfully to Firebase');
    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving user settings:', error);
    return NextResponse.json({ 
      error: 'Failed to save settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}