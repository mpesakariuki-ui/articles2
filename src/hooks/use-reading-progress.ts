'use client';

import { useEffect } from 'react';
import { useAuth } from './use-auth';
import { saveReadingProgress } from '@/lib/firestore';

export function useReadingProgress(postId: string) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      
      if (progress > 10) { // Save progress after 10% read
        saveReadingProgress(user.uid, postId, progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, postId]);
}