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
      <CardContent className="space-y-4">
        {Array.isArray(recentPosts) && recentPosts.map(post => (
          <div key={post.id} className="space-y-2">
            <Link href={`/posts/${post.id}`} className="font-medium text-sm hover:text-primary line-clamp-2">
              {post.title}
            </Link>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">{post.category}</Badge>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}