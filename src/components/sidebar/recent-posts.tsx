'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Post } from '@/lib/types';
import { Clock, Sparkles } from 'lucide-react';

export function RecentPosts() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const explainPosts = async () => {
    if (explanation) {
      setShowExplanation(true);
      return;
    }
    
    setLoading(true);
    setShowExplanation(true);
    
    try {
      const response = await fetch('/api/ai/explain-recent-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: recentPosts.map(p => ({ title: p.title, category: p.category, excerpt: p.excerpt })) })
      });
      
      const data = await response.json();
      setExplanation(data.explanation || 'No explanation available');
    } catch (error) {
      setExplanation('Failed to generate explanation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then((data) => {
        const posts = Array.isArray(data.posts) ? data.posts : [];
        setRecentPosts(posts.slice(0, 5));
      })
      .catch(() => {
        setRecentPosts([]);
      });
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Recent Posts</CardTitle>
          <Button variant="ghost" size="sm" onClick={explainPosts}>
            <Sparkles className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-0">
          <div className="max-h-64 overflow-y-auto">
            {Array.isArray(recentPosts) && recentPosts.map((post, index) => (
              <div key={post.id}>
                <div className="py-3">
                  <Link href={`/posts/${post.id}`} className="font-medium text-sm hover:text-primary line-clamp-2 block mb-1">
                    {post.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {post.createdAt}
                  </div>
                </div>
                {index < recentPosts.length - 1 && (
                  <div className="border-b border-border" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Recent Posts Overview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}