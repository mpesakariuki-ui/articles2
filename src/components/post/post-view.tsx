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
import { BookOpen, Clapperboard, Film, MessageSquare, Sparkles, Tags, Link, Eye, Shield, Edit, Trash2, Target } from 'lucide-react';
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
import { AISidebar } from '@/components/post/ai-sidebar';
import { SmartText } from '@/components/post/smart-text';
import { ReadingRecommendations } from '@/components/post/reading-recommendations';
import { SmartBookmarks } from '@/components/post/smart-bookmarks';
import { PersonalGlossary } from '@/components/post/personal-glossary';
import { ReferencesModal } from '@/components/post/references-modal';
import { TextHighlighter } from '@/components/post/text-highlighter';
import { FollowAuthor } from '@/components/post/follow-author';

import { PostRating } from '@/components/post/post-rating';
import { ExportOptions } from '@/components/post/export-options';
import { calculateReadingTime } from '@/lib/reading-time';
import { useReadingProgress } from '@/hooks/use-reading-progress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Clock } from 'lucide-react';
import { checkAdminAccess } from '@/lib/admin';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { pageview, event } from '@/lib/analytics';

export function PostView({ post }: { post: Post }) {
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const [hideMetadata, setHideMetadata] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isAdmin = checkAdminAccess(user?.email);

  
  useReadingProgress(post.id);

  useEffect(() => {
    fetch(`/api/posts/${post.id}/views`, { method: 'POST' });
    
    // Track page view
    pageview(`/posts/${post.id}`);
    event('page_view', 'post', post.title);
    
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const header = document.querySelector('header');
      
      setHideMetadata(currentScrollY > 200);
      
      if (header) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide header
          header.style.transform = 'translateY(-100%)';
        } else {
          // Scrolling up - show header
          header.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Reset header position on cleanup
      const header = document.querySelector('header');
      if (header) {
        header.style.transform = 'translateY(0)';
      }
    };
  }, [post.id, post.title]);


  
  const authorInitials = post.author.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const isLongPost = post.content.split(' ').length > 150;

  return (
    <div className="relative flex">
      <AISidebar articleContent={post.content} articleTitle={post.title} />
      <article className="flex-1 mx-auto max-w-4xl py-4 md:py-8 lg:py-12 px-4">
      <div className="space-y-4 text-center mb-12">
        <Badge variant="outline">{post.category}</Badge>
        <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter px-2">
          {post.title}
        </h1>
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-muted-foreground transition-opacity duration-300 ${hideMetadata ? 'opacity-0' : 'opacity-100'}`}>
           <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatarUrl} data-ai-hint="author portrait" />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="font-medium">{post.author.name}</span>
              {checkAdminAccess(post.author.email || 'jamexkarix583@gmail.com') && (
                <Shield className="h-4 w-4 text-primary" title="Admin" />
              )}
            </div>
          </div>
          <div className="hidden sm:block">•</div>
          <time dateTime={post.createdAt}>{post.createdAt}</time>
          <div className="hidden sm:block">•</div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{calculateReadingTime(post.content)}</span>
          </div>
          <div className="hidden sm:block">•</div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views || 0} views</span>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <SocialShare title={post.title} url={typeof window !== 'undefined' ? `${window.location.origin}/posts/${post.id}` : `/posts/${post.id}`} />
          <ExportOptions post={post} />
          {isAdmin && (
            <>
              <Button variant="outline" size="sm" onClick={() => router.push(`/admin/posts/edit/${post.id}`)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={async () => {
                if (confirm('Are you sure you want to delete this post?')) {
                  try {
                    const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
                    if (response.ok) {
                      // Clear cache to refresh posts
                      await fetch('/api/posts/cache', { method: 'DELETE' });
                      toast({ title: 'Post deleted successfully' });
                      router.push('/posts');
                    } else {
                      toast({ title: 'Failed to delete post', variant: 'destructive' });
                    }
                  } catch (error) {
                    toast({ title: 'Error deleting post', variant: 'destructive' });
                  }
                }
              }}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      


      <TableOfContents content={post.content} />

      <Card className="mb-8 md:mb-12">
        <CardContent className="p-0">
          <div className="h-[800px] overflow-y-auto">
            <TextHighlighter>
              <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none leading-relaxed p-6 text-left md:text-justify animate-in slide-in-from-bottom duration-700">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="font-headline" {...props} />,
                    h2: ({node, ...props}) => <h2 className="font-headline" {...props} />,
                    h3: ({node, ...props}) => <h3 className="font-headline" {...props} />,
                    hr: ({node, ...props}) => <Separator className="my-6" {...props} />,
                    div: ({node, ...props}) => <div {...props} />,
                    p: ({node, ...props}) => <p {...props} />,
                  }}
                >
                  {post.content.replace(/<div style="text-align: (left|center|right|justify);">(.*?)<\/div>/g, '<div style="text-align: $1;">$2</div>')}
                </ReactMarkdown>
              </div>
            </TextHighlighter>
          </div>
        </CardContent>
      </Card>

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-3xl font-bold flex items-center"><Link className="mr-3 h-7 w-7 text-primary" />References</h2>
            <Button variant="outline" size="sm" onClick={() => setShowReferencesModal(true)}>
              <Sparkles className="h-4 w-4 mr-1" />
              Find URLs
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="max-h-64 overflow-y-auto">
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
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rate this post:</span>
          <PostRating postId={post.id} />
        </div>
        <FollowAuthor authorId={post.author.id} authorName={post.author.name} />
      </div>
      
      <RelatedPosts currentPost={post} />
      
      <FunctionalComments post={post} />


      
      <ReferencesModal 
        isOpen={showReferencesModal}
        onClose={() => setShowReferencesModal(false)}
        references={post.references || []}
      />
    </article>
    </div>
  );
}
