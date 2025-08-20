import { NextResponse } from 'next/server';
import { dataCache } from '@/lib/cache';

export async function DELETE() {
  try {
    dataCache.clear();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
}