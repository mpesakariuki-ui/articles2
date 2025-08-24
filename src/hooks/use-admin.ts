'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function useIsAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!user || authLoading) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/admin/check', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
      
      setLoading(false);
    }

    checkAdmin();
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}
