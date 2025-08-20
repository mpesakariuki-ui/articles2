'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getPost } from '@/lib/firestore';
import type { Post } from '@/lib/types';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Minus, Pilcrow, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRef } from 'react';

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadPost = async () => {
      const { id } = await params;
      const postData = await getPost(id);
      if (postData) {
        setPost(postData);
      } else {
        toast({ title: 'Post not found', variant: 'destructive' });
        router.push('/admin');
      }
      setLoading(false);
    };
    loadPost();
  }, [params, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        toast({ title: 'Post updated successfully' });
        router.push(`/posts/${post.id}`);
      } else {
        toast({ title: 'Failed to update post', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error updating post', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const applyFormat = (format: string, isBlock = false) => {
    const textarea = textareaRef.current;
    if (!textarea || !post) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    let newContent;
    if (isBlock) {
      newContent = post.content.substring(0, start) + format + selectedText + post.content.substring(end);
    } else {
      newContent = post.content.substring(0, start) + format + selectedText + format + post.content.substring(end);
    }
    
    setPost({...post, content: newContent});
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + format.length, start + format.length + selectedText.length);
    }, 0);
  };

  const applyAlignFormat = (alignment: string) => {
    const textarea = textareaRef.current;
    if (!textarea || !post) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    const openTag = `<div style="text-align: ${alignment};">`;
    const closeTag = '</div>';
    const newContent = post.content.substring(0, start) + openTag + selectedText + closeTag + post.content.substring(end);
    
    setPost({...post, content: newContent});
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 0);
  };

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea || !post) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    let linkMarkdown;
    if (selectedText) {
      linkMarkdown = `[${selectedText}](https://example.com)`;
    } else {
      linkMarkdown = '[Link text](https://example.com)';
    }
    
    const newContent = post.content.substring(0, start) + linkMarkdown + post.content.substring(end);
    setPost({...post, content: newContent});
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        const urlStart = start + selectedText.length + 3;
        textarea.setSelectionRange(urlStart, urlStart + 19);
      } else {
        textarea.setSelectionRange(start + 1, start + 10);
      }
    }, 0);
  };

  const insertBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea || !post) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    let listMarkdown;
    if (selectedText) {
      const lines = selectedText.split('\n');
      listMarkdown = lines.map(line => line.trim() ? `- ${line.trim()}` : '').join('\n');
    } else {
      listMarkdown = '\n- List item\n';
    }
    
    const newContent = post.content.substring(0, start) + listMarkdown + post.content.substring(end);
    setPost({...post, content: newContent});
    
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        textarea.setSelectionRange(start + 3, start + 12);
      }
    }, 0);
  };

  const insertNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea || !post) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    let listMarkdown;
    if (selectedText) {
      const lines = selectedText.split('\n');
      listMarkdown = lines.map((line, index) => line.trim() ? `${index + 1}. ${line.trim()}` : '').join('\n');
    } else {
      listMarkdown = '\n1. List item\n';
    }
    
    const newContent = post.content.substring(0, start) + listMarkdown + post.content.substring(end);
    setPost({...post, content: newContent});
    
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        textarea.setSelectionRange(start + 4, start + 13);
      }
    }, 0);
  };

  if (loading) return <div className="container py-8">Loading...</div>;
  if (!post) return <div className="container py-8">Post not found</div>;

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={(e) => setPost({...post, title: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="border rounded-md">
                <div className="flex items-center gap-1 p-2 border-b bg-muted/50 overflow-x-auto flex-wrap">
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('**')} title="Bold">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('*')} title="Italic">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('# ', true)} title="Heading 1">
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('## ', true)} title="Heading 2">
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={insertBulletList} title="Bullet List">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={insertNumberedList} title="Numbered List">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyAlignFormat('left')} title="Align Left">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyAlignFormat('center')} title="Align Center">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyAlignFormat('right')} title="Align Right">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyAlignFormat('justify')} title="Justify">
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={insertLink} title="Insert Link">
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  ref={textareaRef}
                  id="content"
                  value={post.content}
                  onChange={(e) => setPost({...post, content: e.target.value})}
                  className="min-h-[400px] border-0 rounded-t-none focus-visible:ring-0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={post.category}
                onChange={(e) => setPost({...post, category: e.target.value})}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}