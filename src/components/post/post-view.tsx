'use client';

import type { Post } from '@/lib/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Clapperboard, Film, MessageSquare, Sparkles, Tags, Link, Eye } from 'lucide-react';
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
import { SocialShare } from '@/components/post/social-share';
import { TableOfContents } from '@/components/post/table-of-contents';
import { RelatedPosts } from '@/components/post/related-posts';
import { FunctionalComments } from '@/components/post/functional-comments';
import { AIFeaturesModal } from '@/components/post/ai-features-modal';

import { PostRating } from '@/components/post/post-rating';
import { ExportOptions } from '@/components/post/export-options';
import { calculateReadingTime } from '@/lib/reading-time';
import { useReadingProgress } from '@/hooks/use-reading-progress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clock } from 'lucide-react';

export function PostView({ post }: { post: Post }) {
  const [showAIModal, setShowAIModal] = useState(false);

  
  useReadingProgress(post.id);

  useEffect(() => {
    fetch(`/api/posts/${post.id}/views`, { method: 'POST' });
  }, [post.id]);


  
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
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{calculateReadingTime(post.content)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views || 0} views</span>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <SocialShare title={post.title} url={typeof window !== 'undefined' ? `${window.location.origin}/posts/${post.id}` : `/posts/${post.id}`} />
          <ExportOptions post={post} />
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <Button variant="secondary" onClick={() => setShowAIModal(true)}>
          <Sparkles className="mr-2 h-4 w-4" />
          AI Features
        </Button>
      </div>

      <TableOfContents content={post.content} />

      <div className="prose prose-lg dark:prose-invert max-w-none mx-auto leading-relaxed mb-12">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="font-headline" {...props} />,
            h2: ({node, ...props}) => <h2 className="font-headline" {...props} />,
            h3: ({node, ...props}) => <h3 className="font-headline" {...props} />,
            hr: ({node, ...props}) => <Separator className="my-6" {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
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
                   <Image src={lecture.thumbnailUrl} alt={lecture.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" data-ai-hint="video thumbnail" />
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

      {post.references && post.references.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-3xl font-bold mb-6 flex items-center"><Link className="mr-3 h-7 w-7 text-primary" />References</h2>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {post.references.map((ref, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-muted-foreground mr-3">{index + 1}.</span>
                    {ref.startsWith('http') ? (
                      <a href={ref} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {ref}
                      </a>
                    ) : (
                      <span className="break-all">{ref}</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      <PostRating postId={post.id} />
      
      <RelatedPosts currentPost={post} />
      
      <FunctionalComments post={post} />

      <AIFeaturesModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        articleContent={post.content}
        articleTitle={post.title}
      />
    </article>
  );
}
