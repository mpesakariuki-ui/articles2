'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      
      if (user) {
        const token = await user.getIdToken();
        console.log('User ID token:', token);
      }
      
      setUser(user);
      
      if (user) {
        try {
          // Initialize user collections when user signs in
          await fetch('/api/user/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid })
          });
        } catch (error) {
          console.error('Error initializing user collections:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, loading, logout };
}