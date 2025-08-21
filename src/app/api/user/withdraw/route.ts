import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, mpesaNumber } = await request.json();

    if (!userId || !amount || !mpesaNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum withdrawal is KES 100' }, { status: 400 });
    }

    // Create withdrawal transaction
    const transaction = {
      userId,
      type: 'Withdrawal',
      amount,
      mpesaNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    await addDoc(collection(db, 'userTransactions'), transaction);

    // Update user earnings (move available to pending)
    const earningsRef = doc(db, 'userEarnings', userId);
    const earningsDoc = await getDoc(earningsRef);
    
    if (earningsDoc.exists()) {
      const currentEarnings = earningsDoc.data();
      await updateDoc(earningsRef, {
        available: 0,
        pending: (currentEarnings.pending || 0) + amount,
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true, message: 'Withdrawal request submitted' });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 });
  }
}