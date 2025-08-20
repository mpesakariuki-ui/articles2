'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post/post-card';
import { BookOpen, Sparkles } from 'lucide-react';
import type { Post } from '@/lib/types';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface ReadingRecommendationsProps {
  currentPost: Post;
}

export function ReadingRecommendations({ currentPost }: ReadingRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { ref, isVisible } = useScrollReveal();

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/reading-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPost: {
            title: currentPost.title,
            content: currentPost.content.slice(0, 1000),
            category: currentPost.category,
            tags: currentPost.tags
          }
        })
      });
      
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          AI Reading Recommendations
        </CardTitle>
        <Button variant="outline" size="sm" onClick={generateRecommendations} disabled={loading}>
          <Sparkles className="h-4 w-4 mr-1" />
          {loading ? 'Generating...' : 'Get Recommendations'}
        </Button>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((post) => (
              <PostCard key={post.id} post={post} minimal />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Click "Get Recommendations" to discover articles tailored to your interests.
          </p>
        )}
      </CardContent>
      </Card>
    </div>
  );
}