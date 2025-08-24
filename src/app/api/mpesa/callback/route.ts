import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MPESACallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: number | string;
        }>;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as MPESACallback;
    const { stkCallback } = data.Body;
    const { ResultCode, CheckoutRequestID, CallbackMetadata } = stkCallback;

    // Get the transaction doc
    const transactionRef = doc(db, 'mpesa_transactions', CheckoutRequestID);
    const transactionDoc = await getDoc(transactionRef);

    if (!transactionDoc.exists()) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const transaction = transactionDoc.data();
    const userId = transaction.userId;

    if (ResultCode === 0) {
      // Payment successful
      const amount = CallbackMetadata?.Item.find(item => item.Name === 'Amount')?.Value as number;
      const mpesaReceiptNumber = CallbackMetadata?.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value as string;
      const phoneNumber = CallbackMetadata?.Item.find(item => item.Name === 'PhoneNumber')?.Value as string;

      // Update transaction status
      await updateDoc(transactionRef, {
        status: 'completed',
        mpesaReceiptNumber,
        phoneNumber,
        completedAt: new Date().toISOString()
      });

      // Update user's earnings record
      const userEarningsRef = doc(db, 'userEarnings', userId);
      const userEarningsDoc = await getDoc(userEarningsRef);

      if (userEarningsDoc.exists()) {
        await updateDoc(userEarningsRef, {
          totalWithdrawn: (userEarningsDoc.data().totalWithdrawn || 0) + amount,
          lastWithdrawal: new Date().toISOString()
        });
      }

      return NextResponse.json({ success: true });
    } else {
      // Payment failed
      await updateDoc(transactionRef, {
        status: 'failed',
        failureReason: stkCallback.ResultDesc,
        failedAt: new Date().toISOString()
      });

      return NextResponse.json({ success: false, error: stkCallback.ResultDesc });
    }
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}
