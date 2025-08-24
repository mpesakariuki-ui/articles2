'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save } from 'lucide-react';
import type { Post } from '@/lib/types';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    const getParams = async () => {
      const { id } = await params;
      fetchPost(id);
    };
    getParams();
  }, [user, params]);

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setExcerpt(postData.excerpt || '');
        setCategory(postData.category);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({ title: 'Error', description: 'Failed to load post', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const savePost = async () => {
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in title, content, and category.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const { id } = await params;
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || content.slice(0, 200) + '...',
          category,
          updatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast({
          title: 'Post updated!',
          description: 'Your changes have been saved successfully.'
        });
        router.push('/my-posts');
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <h1 className="text-2xl font-bold mb-2">Post not found</h1>
            <p className="text-muted-foreground mb-6">
              The post you're trying to edit doesn't exist or you don't have permission to edit it.
            </p>
            <Button onClick={() => router.push('/my-posts')}>
              Back to My Posts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Edit Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description (optional)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Philosophy">Philosophy</SelectItem>
                  <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Psychology">Psychology</SelectItem>
                  <SelectItem value="Literature">Literature</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                  <SelectItem value="Social Issues">Social Issues</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={20}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={savePost} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => router.push('/my-posts')}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}