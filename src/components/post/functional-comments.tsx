'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Comment, Post } from '@/lib/types';
import { MessageSquare } from 'lucide-react';

interface FunctionalCommentsProps {
  post: Post;
}

export function FunctionalComments({ post }: FunctionalCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: newComment.trim(),
          author: {
            id: 'current-user',
            name: 'Anonymous User',
            avatarUrl: 'https://placehold.co/100x100.png'
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');
      
      const { comment } = await response.json();
      setComments(prev => [...prev, comment]);
      setNewComment('');
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2 className="font-headline text-3xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-3 h-7 w-7 text-primary" />
        Comments ({comments.length})
      </h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
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
          <Separator className="my-6"/>
          <form onSubmit={handleSubmit} className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src="https://placehold.co/100x100.png" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="w-full space-y-2">
              <Textarea 
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}