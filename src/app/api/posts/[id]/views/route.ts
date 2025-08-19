import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/store';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    incrementViews(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}