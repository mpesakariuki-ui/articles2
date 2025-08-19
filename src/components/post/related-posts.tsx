'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './post-card';
import type { Post } from '@/lib/types';

interface RelatedPostsProps {
  currentPost: Post;
}

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then((posts: Post[]) => {
        const related = posts
          .filter(post => post.id !== currentPost.id)
          .filter(post => 
            post.category === currentPost.category ||
            post.tags.some(tag => currentPost.tags.includes(tag))
          )
          .slice(0, 3);
        setRelatedPosts(related);
      });
  }, [currentPost]);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="font-headline text-3xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}