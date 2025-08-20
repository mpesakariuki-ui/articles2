'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { Clock } from 'lucide-react';

export function RecentPosts() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
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
      </CardContent>
    </Card>
  );
}