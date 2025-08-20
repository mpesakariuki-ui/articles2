import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase/auth';
import { checkAdminAccess } from '@/lib/admin';

export async function adminMiddleware(request: NextRequest) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!checkAdminAccess(user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
