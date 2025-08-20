'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Comment, Post } from '@/lib/types';
import { MessageSquare } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface FunctionalCommentsProps {
  post: Post;
}

export function FunctionalComments({ post }: FunctionalCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      const data = await response.json();
      if (Array.isArray(data.comments)) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a comment.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: newComment.trim()
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }
      
      const { comment } = await response.json();
      setComments(prev => [...prev, comment]);
      setNewComment('');
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added.",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <section className="mb-12">
      <h2 className="font-headline text-3xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-3 h-7 w-7 text-primary" />
        Comments ({comments.length})
      </h2>
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-muted-foreground">Loading comments...</span>
            </div>
          ) : (
            <>
              {comments.length > 0 ? (
                <div className="space-y-6 mb-6">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={comment.author.avatarUrl} />
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
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No comments yet. Be the first to comment!
                </div>
              )}
              <Separator className="my-6"/>
              <form onSubmit={handleSubmit} className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} />
                  <AvatarFallback>{user?.displayName?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="w-full space-y-2">
                  {!user ? (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-muted-foreground mb-2">Sign in to leave a comment</p>
                      <Button 
                        type="button" 
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          const authModal = document.getElementById('auth-modal');
                          if (authModal instanceof HTMLDialogElement) {
                            authModal.showModal();
                          }
                        }}
                      >
                        Sign In
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Textarea 
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isSubmitting}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                          {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
      </section>
    </div>
  );
}