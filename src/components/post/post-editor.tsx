'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DraftSystem } from '@/components/post/draft-system';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Minus, Pilcrow, Image } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function PostEditor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [bookRecs, setBookRecs] = useState('');
  const [lectures, setLectures] = useState('');
  const [references, setReferences] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formData = { title: '', content, category: '', tags: '' };
  
  const loadDraftData = (data: any) => {
    setContent(data.content || '');
    setSubtopic(data.subtopic || '');
    setBookRecs(data.bookRecs || '');
    setLectures(data.lectures || '');
    setReferences(data.references || '');
  };

  const applyFormat = (format: string, isBlock = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newContent;
    if (isBlock) {
      newContent = content.substring(0, start) + format + selectedText + content.substring(end);
    } else {
      newContent = content.substring(0, start) + format + selectedText + format + content.substring(end);
    }
    
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + format.length, start + format.length + selectedText.length);
    }, 0);
  };

  const insertDivider = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + '\n\n---\n\n' + content.substring(start);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 7, start + 7);
    }, 0);
  };

  const insertParagraph = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + '\n\n' + content.substring(start);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  const insertImage = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const imageMarkdown = '![Image description](https://example.com/image.jpg)';
    const newContent = content.substring(0, start) + imageMarkdown + content.substring(start);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 19); // Select "Image description"
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean);
    const imageFile = formData.get('image') as File;

    let coverImage = 'https://placehold.co/1200x630.png';
    
    if (imageFile && imageFile.size > 0) {
      const reader = new FileReader();
      coverImage = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          category, 
          tags, 
          coverImage,
          subtopic,
          bookRecommendations: bookRecs,
          lectures,
          references
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      
      const { post } = await response.json();
      
      toast({
        title: "Success!",
        description: "Your post has been published.",
      });
      
      router.push(`/posts/${post.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Create a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a compelling title"
                className="text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="border rounded-md">
                <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
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
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('- ', true)} title="Bullet List">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('1. ', true)} title="Numbered List">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={insertImage} title="Insert Image">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={insertParagraph} title="New Paragraph">
                    <Pilcrow className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={insertDivider} title="Divider">
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  ref={textareaRef}
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your masterpiece... (Markdown supported)"
                  className="min-h-[400px] text-base border-0 rounded-t-none focus-visible:ring-0"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Thumbnail Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtopic">Subtopic</Label>
              <Input
                id="subtopic"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                placeholder="Brief subtopic or summary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Art History, Physics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g., Renaissance, Quantum Mechanics"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookRecs">Book Recommendations</Label>
              <Textarea
                id="bookRecs"
                value={bookRecs}
                onChange={(e) => setBookRecs(e.target.value)}
                placeholder="List recommended books (one per line)\ne.g., The Art of War by Sun Tzu"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lectures">Lectures & Materials</Label>
              <Textarea
                id="lectures"
                value={lectures}
                onChange={(e) => setLectures(e.target.value)}
                placeholder="List lectures, videos, or materials (one per line)\ne.g., Introduction to Physics - https://youtube.com/watch?v=..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="references">References & URLs</Label>
              <Textarea
                id="references"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder="Add reference URLs (one per line)\ne.g., https://example.com/research-paper"
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-between">
              <DraftSystem formData={formData} onLoadDraft={loadDraftData} />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
