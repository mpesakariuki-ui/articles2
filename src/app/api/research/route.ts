import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, orderBy, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateDOI } from '@/lib/doi';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const docRef = await addDoc(collection(db, 'research'), {});
    const doi = generateDOI(docRef.id);
    
    const paper = {
      ...data,
      doi,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citations: 0,
      downloads: 0,
      content: `${data.introduction}\n\n${data.methodology}\n\n${data.results}\n\n${data.discussion}\n\n${data.conclusion}`,
      coAuthors: data.coAuthors || [],
      plagiarismScore: null,
      referencesValidated: false,
      thumbnail: data.thumbnail || null,
      authorId: data.authorId || null
    };

    await updateDoc(docRef, paper);
    
    return NextResponse.json({ id: docRef.id, ...paper });
  } catch (error) {
    console.error('Error creating research paper:', error);
    return NextResponse.json({ error: 'Failed to create paper' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const q = query(collection(db, 'research'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const papers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ papers });
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return NextResponse.json({ papers: [] });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({ error: 'Paper ID required' }, { status: 400 });
    }

    await deleteDoc(doc(db, 'research', id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting research paper:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}