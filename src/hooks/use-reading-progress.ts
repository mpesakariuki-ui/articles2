'use client';

import { useEffect } from 'react';
import { useAuth } from './use-auth';
import { saveReadingProgress } from '@/lib/firestore';

export function useReadingProgress(postId: string) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let lastSaveTime = 0;
    const SAVE_INTERVAL = 5000; // Only save every 5 seconds max

    const handleScroll = async () => {
      const now = Date.now();
      if (now - lastSaveTime < SAVE_INTERVAL) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      
      if (progress > 10) { // Save progress after 10% read
        try {
          await saveReadingProgress(user.uid, postId, progress);
          lastSaveTime = now;
        } catch (error) {
          console.error('Failed to save reading progress:', error);
          // Don't throw the error to prevent React from unmounting
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, postId]);
}