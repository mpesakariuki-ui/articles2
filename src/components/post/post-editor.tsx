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
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Minus, Pilcrow, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Sparkles, Wand2, Tags, Table } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';

export function PostEditor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [bookRecs, setBookRecs] = useState('');
  const [lectures, setLectures] = useState('');
  const [references, setReferences] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formData = { title: '', content, category: '', tags: '' };
  
  const loadDraftData = (data: any) => {
    setContent(data.content || '');
    setSubtopic(data.subtopic || '');
    setBookRecs(data.bookRecs || '');
    setLectures(data.lectures || '');
    setReferences(data.references || '');
  };

  const insertTable = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    const newContent = content.substring(0, start) + tableTemplate + content.substring(start);
    setContent(newContent);
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

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let linkMarkdown;
    if (selectedText) {
      // Wrap selected text with link
      linkMarkdown = `[${selectedText}](https://example.com)`;
    } else {
      // Insert new link
      linkMarkdown = '[Link text](https://example.com)';
    }
    
    const newContent = content.substring(0, start) + linkMarkdown + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        // Select the URL part
        const urlStart = start + selectedText.length + 3;
        textarea.setSelectionRange(urlStart, urlStart + 19);
      } else {
        // Select "Link text"
        textarea.setSelectionRange(start + 1, start + 10);
      }
    }, 0);
  };

  const insertBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let listMarkdown;
    if (selectedText) {
      const lines = selectedText.split('\n');
      listMarkdown = lines.map(line => line.trim() ? `- ${line.trim()}` : '').join('\n');
    } else {
      listMarkdown = '\n- List item\n';
    }
    
    const newContent = content.substring(0, start) + listMarkdown + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        textarea.setSelectionRange(start + 3, start + 12);
      }
    }, 0);
  };

  const insertNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let listMarkdown;
    if (selectedText) {
      const lines = selectedText.split('\n');
      listMarkdown = lines.map((line, index) => line.trim() ? `${index + 1}. ${line.trim()}` : '').join('\n');
    } else {
      listMarkdown = '\n1. List item\n';
    }
    
    const newContent = content.substring(0, start) + listMarkdown + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        textarea.setSelectionRange(start + 4, start + 13);
      }
    }, 0);
  };

  const applyAlignFormat = (alignment: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let alignedText;
    if (selectedText) {
      alignedText = `\n<div style="text-align: ${alignment};">${selectedText}</div>\n`;
    } else {
      alignedText = `\n<div style="text-align: ${alignment};">Your text here</div>\n`;
    }
    
    const newContent = content.substring(0, start) + alignedText + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        const textStart = start + `\n<div style="text-align: ${alignment};">`.length;
        textarea.setSelectionRange(textStart, textStart + 13);
      }
    }, 0);
  };

  const generateExcerpt = async () => {
    if (!content.trim()) {
      toast({ title: 'Please write some content first', variant: 'destructive' });
      return;
    }
    
    try {
      const response = await fetch('/api/ai/generate-excerpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      const data = await response.json();
      if (data.excerpt) {
        setExcerpt(data.excerpt);
        toast({ title: 'Excerpt generated successfully!' });
      }
    } catch (error) {
      toast({ title: 'Failed to generate excerpt', variant: 'destructive' });
    }
  };

  const suggestTags = async () => {
    if (!content.trim()) {
      toast({ title: 'Please write some content first', variant: 'destructive' });
      return;
    }
    
    try {
      const response = await fetch('/api/ai/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      });
      
      const data = await response.json();
      if (data.tags) {
        setTags(data.tags.join(', '));
        toast({ title: 'Tags suggested successfully!' });
      }
    } catch (error) {
      toast({ title: 'Failed to suggest tags', variant: 'destructive' });
    }
  };

  const improveContent = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (!selectedText.trim()) {
      toast({ title: 'Please select text to improve', variant: 'destructive' });
      return;
    }
    
    try {
      const response = await fetch('/api/ai/improve-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText })
      });
      
      const data = await response.json();
      if (data.improvedText) {
        const newContent = content.substring(0, start) + data.improvedText + content.substring(end);
        setContent(newContent);
        toast({ title: 'Content improved successfully!' });
      }
    } catch (error) {
      toast({ title: 'Failed to improve content', variant: 'destructive' });
    }
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

    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to create a post.",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description for post cards (150 characters max)"
                className="min-h-[80px]"
                maxLength={150}
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
                  <Button type="button" variant="ghost" size="sm" onClick={insertTable} title="Insert Table">
                    <Table className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={insertImage} title="Insert Image">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={insertLink} title="Insert Link">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={generateExcerpt} title="AI Generate Excerpt">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={suggestTags} title="AI Suggest Tags">
                    <Tags className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={improveContent} title="AI Improve Content">
                    <Wand2 className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={insertParagraph} title="New Paragraph">
                    <Pilcrow className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={insertDivider} title="Divider">
                    <Minus className="h-4 w-4" />
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
