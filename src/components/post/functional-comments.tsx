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
  const [comments, setComments] = useState<Comment[]>([]);
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
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          text: newComment.trim(),
          userId: user.uid,
          userName: user.displayName,
          userEmail: user.email,
          userAvatar: user.photoURL
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
        title: "💬 Comment posted!",
        description: "Your comment has been added to the discussion.",
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
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-6 mb-6">
        <h2 className="font-headline text-3xl font-bold mb-2 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <MessageSquare className="mr-3 h-7 w-7 text-blue-600" />
          Join the Conversation
        </h2>
        <p className="text-muted-foreground">{comments.length} {comments.length === 1 ? 'comment' : 'comments'} • Share your thoughts below</p>
      </div>
      <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 shadow-lg">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-muted-foreground">Loading comments...</span>
            </div>
          ) : (
            <>
              {comments.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {comments.map((comment, index) => (
                    <div key={comment.id} className={`p-4 rounded-lg border-l-4 border-blue-500 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 hover:shadow-md transition-all duration-300 animate-in slide-in-from-left-5`} style={{animationDelay: `${index * 100}ms`}}>
                      <div className="flex items-start space-x-4">
                        <Avatar className="ring-2 ring-blue-200 dark:ring-blue-800">
                          <AvatarImage src={comment.author?.avatarUrl} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">{comment.author?.name?.split(' ').map(n=>n[0]).join('') || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-blue-900 dark:text-blue-100">{comment.author?.name || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground bg-white dark:bg-gray-800 px-2 py-1 rounded-full">{comment.createdAt}</p>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">No comments yet</p>
                  <p className="text-muted-foreground">Be the first to share your thoughts!</p>
                </div>
              )}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 my-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Your Comment
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="flex items-start space-x-4">
                <Avatar className="ring-2 ring-blue-200 dark:ring-blue-800">
                  <AvatarImage src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=random`} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">{user?.displayName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="w-full space-y-2">
                  {!user ? (
                    <div className="text-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                      <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                      <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Join the Discussion</p>
                      <p className="text-muted-foreground mb-4">Sign in to share your thoughts and connect with the community</p>
                      <Button 
                        type="button" 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white border-0"
                        onClick={() => {
                          const authModal = document.getElementById('auth-modal');
                          if (authModal instanceof HTMLDialogElement) {
                            authModal.showModal();
                          }
                        }}
                      >
                        Sign In to Comment
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Textarea 
                        placeholder="Share your thoughts, ask questions, or start a discussion..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isSubmitting}
                        className="min-h-[120px] border-2 border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-400 rounded-lg"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-muted-foreground">Be respectful and constructive in your comments</p>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || !newComment.trim()}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white border-0 px-6"
                        >
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