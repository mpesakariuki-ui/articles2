import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { mpesa } from '@/lib/mpesa';

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, mpesaNumber } = await request.json();

    if (!userId || !amount || !mpesaNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum withdrawal is KES 100' }, { status: 400 });
    }

    // Verify user has sufficient balance
    const earningsRef = doc(db, 'userEarnings', userId);
    const earningsDoc = await getDoc(earningsRef);
    
    if (!earningsDoc.exists()) {
      return NextResponse.json({ error: 'User earnings not found' }, { status: 404 });
    }

    const currentEarnings = earningsDoc.data();
    if ((currentEarnings.available || 0) < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create withdrawal transaction
    const transactionRef = await addDoc(collection(db, 'mpesa_transactions'), {
      userId,
      type: 'Withdrawal',
      amount,
      mpesaNumber,
      status: 'initiated',
      createdAt: new Date().toISOString()
    });

    // Initiate M-Pesa STK Push
    try {
      const stkResponse = await mpesa.initiateSTKPush(
        mpesaNumber,
        amount,
        `WD${transactionRef.id}`, // Account reference
        'Pillar Page Earnings Withdrawal'
      );

      if (stkResponse.success) {
        // Update transaction with checkout request ID
        await updateDoc(transactionRef, {
          checkoutRequestId: stkResponse.CheckoutRequestID,
          merchantRequestId: stkResponse.MerchantRequestID,
          status: 'pending_confirmation'
        });

        // Update user earnings (move amount to pending)
        await updateDoc(earningsRef, {
          available: (currentEarnings.available || 0) - amount,
          pending: (currentEarnings.pending || 0) + amount,
          lastWithdrawalAttempt: new Date().toISOString()
        });

        return NextResponse.json({
          success: true,
          message: 'Please complete the payment on your phone',
          checkoutRequestId: stkResponse.CheckoutRequestID
        });
      } else {
        throw new Error('STK push failed');
      }
    } catch (mpesaError) {
      // If M-Pesa request fails, update transaction status
      await updateDoc(transactionRef, {
        status: 'failed',
        error: mpesaError instanceof Error ? mpesaError.message : 'Unknown error',
        failedAt: new Date().toISOString()
      });

      const errorMessage = mpesaError instanceof Error ? mpesaError.message : 'M-Pesa request failed';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 });
  }
}