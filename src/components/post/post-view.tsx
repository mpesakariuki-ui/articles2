'use client';

import type { Post } from '@/lib/types';
import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Clapperboard, Film, MessageSquare, Sparkles, Tags } from 'lucide-react';
import { generatePostSummary } from '@/ai/flows/generate-post-summary';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';

// A simple function to render basic markdown
const renderMarkdown = (content: string) => {
  const lines = content.split('\n');
  const elements = [];
  let listType: 'ul' | 'ol' | null = null;
  let listItems: JSX.Element[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'ul') {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-2">{listItems}</ul>);
      } else if (listType === 'ol') {
        elements.push(<ol key={`ol-${elements.length}`} className="list-decimal pl-5 space-y-2">{listItems}</ol>);
      }
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    line = line.trim();

    // Check for list items
    const isUl = line.startsWith('- ');
    const isOl = /^\d+\.\s/.test(line);

    if (!isUl && !isOl && listType) {
      flushList();
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(4)}</h3>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-2xl font-bold mt-6 mb-3">{line.substring(3)}</h2>);
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>);
    } else if (line.startsWith('---')) {
      flushList();
      elements.push(<Separator key={index} className="my-6" />);
    } else if (isUl) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(<li key={index}>{line.substring(2)}</li>);
    } else if (isOl) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(<li key={index}>{line.replace(/^\d+\.\s/, '')}</li>);
    } else if (line) {
      flushList();
      // Basic inline formatting
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />);
    } else {
      // Keep empty lines for spacing between paragraphs
      flushList();
      elements.push(<div key={index} className="h-4" />);
    }
  });

  flushList(); // Flush any remaining list items
  return elements;
};

export function PostView({ post }: { post: Post }) {
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    setSummary('');
    try {
      const result = await generatePostSummary({ post: post.content });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Sorry, we couldn\'t generate a summary for this post.');
    } finally {
      setIsLoadingSummary(false);
    }
  };
  
  const authorInitials = post.author.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const isLongPost = post.content.split(' ').length > 150;

  return (
    <article className="container max-w-4xl py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <Badge variant="outline">{post.category}</Badge>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
          {post.title}
        </h1>
        <div className="flex items-center justify-center space-x-4 text-muted-foreground">
           <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatarUrl} data-ai-hint="author portrait" />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{post.author.name}</span>
          </div>
          <span>•</span>
          <time dateTime={post.createdAt}>{post.createdAt}</time>
        </div>
      </div>
      
      {isLongPost && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex justify-center mb-8">
              <Button variant="secondary" onClick={handleGenerateSummary}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Summary
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">AI Summary</DialogTitle>
              <DialogDescription>
                A quick summary of the post generated by AI.
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {isLoadingSummary && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[70%]" />
                </div>
              )}
              {summary && <p>{summary}</p>}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mx-auto leading-relaxed mb-12">
        {renderMarkdown(post.content)}
      </div>

      <div className="flex items-center space-x-2 mb-12">
        <Tags className="h-5 w-5 text-muted-foreground" />
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">{tag}</Badge>
        ))}
      </div>

      <Separator className="my-12" />

      {post.recommendedBooks.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-3xl font-bold mb-6 flex items-center"><BookOpen className="mr-3 h-7 w-7 text-primary" />Book Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {post.recommendedBooks.map(book => (
              <Card key={book.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Image src={book.imageUrl} alt={book.title} width={300} height={400} className="w-full h-auto object-cover" data-ai-hint="book cover" />
                  <div className="p-4">
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {post.lectures.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-3xl font-bold mb-6 flex items-center"><Film className="mr-3 h-7 w-7 text-primary" />Lectures & Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {post.lectures.map(lecture => (
              <Card key={lecture.id} className="group overflow-hidden">
                <div className="relative aspect-video">
                   <Image src={lecture.thumbnailUrl} alt={lecture.title} fill className="object-cover" data-ai-hint="video thumbnail" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Clapperboard className="h-12 w-12 text-white" />
                   </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{lecture.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-headline text-3xl font-bold mb-6 flex items-center"><MessageSquare className="mr-3 h-7 w-7 text-primary" />Comments ({post.comments.length})</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={comment.author.avatarUrl} data-ai-hint="user avatar"/>
                    <AvatarFallback>{comment.author.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-6"/>
            <div className="flex items-start space-x-4">
               <Avatar>
                  <AvatarImage src={post.author.avatarUrl} data-ai-hint="current user avatar" />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
              <div className="w-full space-y-2">
                <Textarea placeholder="Write a comment..." />
                <Button>Post Comment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

    </article>
  );
}
