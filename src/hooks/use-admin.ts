'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { checkAdminAccess } from '@/lib/admin';

export function useIsAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't update admin status until auth is done loading
    if (authLoading) {
      return;
    }

    setIsAdmin(checkAdminAccess(user?.email));
    setLoading(false);
  }, [user?.email, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}
