import { NextRequest, NextResponse } from 'next/server';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Paper ID required' }, { status: 400 });
    }

    console.log('Attempting to delete research paper with ID:', id);
    
    const docRef = doc(db, 'research', id);
    await deleteDoc(docRef);
    
    console.log('Research paper deleted successfully:', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting research paper:', error);
    return NextResponse.json({ 
      error: 'Failed to delete paper', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Paper ID required' }, { status: 400 });
    }

    const docRef = doc(db, 'research', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error('Error fetching research paper:', error);
    return NextResponse.json({ error: 'Failed to fetch paper' }, { status: 500 });
  }
}