'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post/post-card';
import { PlusCircle, FileText, Edit, Trash2, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Post } from '@/lib/types';
import Link from 'next/link';

export default function MyPostsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!user) {
      return; // Don't redirect, show sign-in prompt instead
    }

    fetchMyPosts();
  }, [user, authLoading]);

  const fetchMyPosts = async () => {
    try {
      const response = await fetch(`/api/posts/user/${user?.email}`);
      if (response.ok) {
        const posts = await response.json();
        setMyPosts(posts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePostLock = async (postId: string, isLocked: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: !isLocked })
      });
      
      if (response.ok) {
        // Post updated
        toast({ 
          title: isLocked ? 'Post unlocked' : 'Post locked', 
          description: isLocked ? 'Post is now public' : 'Post is now private' 
        });
      }
    } catch (error) {
      console.error('Error toggling post lock:', error);
      toast({ title: 'Error', description: 'Failed to update post visibility', variant: 'destructive' });
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMyPosts(posts => posts.filter(post => post.id !== postId));
        toast({ title: 'Post deleted', description: 'Your post has been deleted successfully.' });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to view your posts. Create an account or sign in to get started.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">My Posts</h1>
          <p className="text-muted-foreground">Manage your published articles</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create-post">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/research/create">
              <FileText className="mr-2 h-4 w-4" />
              Submit Research Paper
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : myPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {myPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Published {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt || post.content?.slice(0, 150) + '...'}
                </p>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/edit-post/${post.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePost(post.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`lock-${post.id}`}
                      checked={false}
                      onCheckedChange={() => togglePostLock(post.id, false)}
                    />
                    <Label htmlFor={`lock-${post.id}`} className="flex items-center gap-1">
                      <Unlock className="h-4 w-4" />
                      Public
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any posts yet. Start sharing your thoughts with the community!
            </p>
            <Button asChild>
              <Link href="/create-post">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}