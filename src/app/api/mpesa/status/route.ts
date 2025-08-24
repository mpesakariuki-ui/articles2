import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { mpesa } from '@/lib/mpesa';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const checkoutRequestId = url.searchParams.get('checkoutRequestId');

    if (!checkoutRequestId) {
      return NextResponse.json({ error: 'Checkout request ID required' }, { status: 400 });
    }

    // Check local transaction status first
    const transactionRef = doc(db, 'mpesa_transactions', checkoutRequestId);
    const transactionDoc = await getDoc(transactionRef);

    if (!transactionDoc.exists()) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const transaction = transactionDoc.data();

    // If transaction is already completed or failed, return the status
    if (['completed', 'failed'].includes(transaction.status)) {
      return NextResponse.json({
        status: transaction.status,
        ...transaction
      });
    }

    // If still pending, query M-Pesa for status
    const statusResponse = await mpesa.queryTransactionStatus(checkoutRequestId);

    return NextResponse.json({
      status: transaction.status,
      mpesaStatus: statusResponse
    });
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return NextResponse.json(
      { error: 'Failed to check transaction status' },
      { status: 500 }
    );
  }
}
