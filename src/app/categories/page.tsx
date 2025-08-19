'use client';

import { useState, useEffect } from 'react';
import { PostCard } from '@/components/post/post-card';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';

export default function CategoriesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        const uniqueCategories = [...new Set(data.map((post: Post) => post.category))];
        setCategories(uniqueCategories);
      });
  }, []);

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold mb-8">Browse by Category</h1>
      
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge 
          variant={selectedCategory === '' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('')}
        >
          All Categories
        </Badge>
        {categories.map(category => (
          <Badge 
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}