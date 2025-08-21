'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface FollowAuthorProps {
  authorId: string;
  authorName: string;
}

export function FollowAuthor({ authorId, authorName }: FollowAuthorProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    if (user) {
      checkFollowStatus();
    }
  }, [user, authorId]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/follow/status?userId=${user?.uid}&authorId=${authorId}`);
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to follow authors.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          authorId,
          action: isFollowing ? 'unfollow' : 'follow'
        })
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        toast({
          title: isFollowing ? 'Unfollowed' : 'Following',
          description: isFollowing 
            ? `You unfollowed ${authorName}` 
            : `You're now following ${authorName}. You'll be notified of new posts.`
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update follow status.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
      className="min-h-[44px] touch-manipulation px-3"
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4 mr-2" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}