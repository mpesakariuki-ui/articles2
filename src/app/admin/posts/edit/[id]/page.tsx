'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdminNav } from '@/components/admin/admin-nav';
import { useToast } from '@/hooks/use-toast';
import type { Post } from '@/lib/types';

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => {
          toast({ title: "Error", description: "Failed to load post", variant: "destructive" });
          setLoading(false);
        });
    });
  }, [params, toast]);

  const handleSave = async () => {
    if (!post) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
          coverImage: post.coverImage
        })
      });

      if (response.ok) {
        toast({ title: "Success", description: "Post updated successfully" });
        router.push('/admin/posts');
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update post", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container py-8">Loading...</div>;
  if (!post) return <div className="container py-8">Post not found</div>;

  return (
    <div className="container max-w-4xl py-8">
      <AdminNav />
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={post.title}
              onChange={(e) => setPost({...post, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={post.category}
              onChange={(e) => setPost({...post, category: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={post.tags.join(', ')}
              onChange={(e) => setPost({...post, tags: e.target.value.split(',').map(t => t.trim())})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={post.coverImage}
              onChange={(e) => setPost({...post, coverImage: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={post.content}
              onChange={(e) => setPost({...post, content: e.target.value})}
              className="min-h-[400px]"
            />
          </div>
          
          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/posts')}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}