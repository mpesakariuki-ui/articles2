import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const postDoc = await adminDb.collection('posts').doc(id).get();
    
    if (!postDoc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ id: postDoc.id, ...postDoc.data() });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    await adminDb.collection('posts').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headersList = request.headers;
    const authHeader = headersList.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Check if user is admin
    if (decodedToken.email !== 'jamexkarix583@gmail.com') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const postDoc = await adminDb.collection('posts').doc(id).get();
    if (!postDoc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    await adminDb.collection('posts').doc(id).delete();
    
    // Clear cache to refresh homepage and recent posts
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/posts/cache`, {
        method: 'DELETE'
      });
    } catch (cacheError) {
      console.log('Cache clear failed, but post deleted successfully');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}