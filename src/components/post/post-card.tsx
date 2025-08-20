import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { calculateReadingTime } from '@/lib/reading-time';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  minimal?: boolean;
}

export function PostCard({ post, minimal = false }: PostCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  
  const authorInitials = post.author.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const getSummary = async () => {
    if (summary) {
      setShowSummary(true);
      return;
    }
    
    setLoading(true);
    setShowSummary(true);
    
    try {
      const response = await fetch('/api/ai/post-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, content: post.content, title: post.title })
      });
      
      const data = await response.json();
      setSummary(data.summary || 'Summary not available');
    } catch (error) {
      setSummary('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className={`flex flex-col overflow-hidden ${minimal ? '' : 'transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl'} touch-manipulation`}>
      <CardHeader className={minimal ? 'p-4' : undefined}>
        {!minimal && (
          <div className="relative aspect-video w-full mb-4">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-t-lg object-cover"
              data-ai-hint="article illustration"
            />
          </div>
        )}
        <div className="space-y-1">
          {post.category && (
            <Badge variant="outline" className="text-sm mb-2">{post.category}</Badge>
          )}
          <CardTitle className={minimal ? "font-headline text-lg" : "font-headline text-2xl"}>
            <Link href={`/posts/${post.id}`} className="hover:text-primary">{post.title}</Link>
          </CardTitle>
          {!minimal && <CardDescription className="line-clamp-2">{post.excerpt.replace(/<[^>]*>/g, '')}</CardDescription>}
        </div>
      </CardHeader>
      {!minimal && <CardContent className="flex-grow" />}
      <CardFooter className={`flex flex-col gap-3 ${minimal ? 'pt-2 pb-4 px-4' : ''}`}>
        {!minimal ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="author portrait" />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{post.author.name}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              <span>{post.createdAt}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{calculateReadingTime(post.content)}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span>{post.author.name}</span>
            <span className="text-center">{post.createdAt}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{calculateReadingTime(post.content)}</span>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              getSummary();
            }}
            className="text-xs touch-manipulation min-h-[44px] sm:min-h-auto"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI Summary
          </Button>
          <Link href={`/posts/${post.id}`} className="flex items-center justify-center sm:justify-start text-sm text-primary hover:text-primary/80 transition-colors font-medium min-h-[44px] sm:min-h-auto touch-manipulation">
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardFooter>
      </Card>
    
    <Dialog open={showSummary} onOpenChange={setShowSummary}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Summary
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <h4 className="font-medium">{post.title}</h4>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
}
