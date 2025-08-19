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
      .then((data) => {
        const posts = Array.isArray(data.posts) ? data.posts : [];
        const related = posts
          .filter((post: Post) => post.id !== currentPost.id)
          .filter((post: Post) => 
            post.category === currentPost.category ||
            (Array.isArray(post.tags) && Array.isArray(currentPost.tags) &&
             post.tags.some((tag: string) => currentPost.tags.includes(tag)))
          )
          .slice(0, 3);
        setRelatedPosts(related);
      })
      .catch((error) => {
        console.error('Error fetching related posts:', error);
        setRelatedPosts([]);
      });
  }, [currentPost]);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="font-headline text-3xl font-bold mb-6">Related Posts</h2>
      <div className="flex flex-col space-y-4">
        {relatedPosts.map(post => (
          <PostCard key={post.id} post={post} minimal={true} />
        ))}
      </div>
    </section>
  );
}