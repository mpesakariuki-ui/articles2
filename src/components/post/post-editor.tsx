'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Code, Image as ImageIcon, Sparkles, Video, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Minus } from 'lucide-react';
import { improveWritingStyle } from '@/ai/flows/improve-writing-style';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { addPost } from '@/lib/data';
import type { Post } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  category: z.string().min(1, 'Category is required.'),
  tags: z.string(),
  content: z.string().min(1, 'Content is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function PostEditor() {
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      tags: '',
      content: '',
    },
  });

  const content = form.watch('content');

  const handleImproveWriting = async () => {
    if (!content) return;
    setIsImproving(true);
    try {
      const result = await improveWritingStyle({ text: content });
      form.setValue('content', result.improvedText);
    } catch (error) {
      console.error('Failed to improve writing:', error);
      toast({
        title: "Error",
        description: "Couldn't improve the text. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsImproving(false);
    }
  };

  const applyMarkdown = (markdown: string, isBlock = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const currentContent = form.getValues('content');

    let newContent;

    if (isBlock) {
      newContent = `${currentContent.substring(0, start)}${markdown}${selectedText}${currentContent.substring(end)}`;
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(start + markdown.length, start + markdown.length + selectedText.length), 0);
    } else {
      newContent = `${currentContent.substring(0, start)}${markdown}${selectedText}${markdown}${currentContent.substring(end)}`;
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(start + markdown.length, start + markdown.length + selectedText.length), 0);
    }
    
    form.setValue('content', newContent);
  };

  const insertDivider = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentContent = form.getValues('content');
    const newContent = `${currentContent.substring(0, start)}\n\n---\n\n${currentContent.substring(start)}`;
    form.setValue('content', newContent);
    textarea.focus();
    setTimeout(() => textarea.setSelectionRange(start + 7, start + 7), 0);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newPost: Omit<Post, 'id' | 'author' | 'createdAt' | 'comments' | 'recommendedBooks' | 'lectures' | 'coverImage'> & { tags: string[] } = {
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      excerpt: data.content.substring(0, 150) + '...',
    };

    const addedPost = addPost(newPost);
    toast({
      title: "Success!",
      description: "Your post has been published.",
    });
    router.push(`/posts/${addedPost.id}`);
  };

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Create a New Post</CardTitle>
          <CardDescription>
            Compose your article, poem, or research paper. Use the AI tools to enhance your writing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a compelling title" className="text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Tabs defaultValue="image" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="image"><ImageIcon className="mr-2 h-4 w-4" /> Thumbnail</TabsTrigger>
                  <TabsTrigger value="video"><Video className="mr-2 h-4 w-4" /> Video</TabsTrigger>
                  <TabsTrigger value="code"><Code className="mr-2 h-4 w-4" /> Code</TabsTrigger>
                </TabsList>
                <TabsContent value="image">
                  <div className="space-y-2">
                    <Label htmlFor="thumb-image">Upload Thumbnail Image</Label>
                    <Input id="thumb-image" type="file" />
                  </div>
                </TabsContent>
                <TabsContent value="video">
                  <div className="space-y-2">
                    <Label htmlFor="video-url">Video URL</Label>
                    <Input id="video-url" placeholder="e.g., https://youtube.com/watch?v=..." />
                  </div>
                </TabsContent>
                <TabsContent value="code">
                  <div className="space-y-2">
                    <Label htmlFor="code-snippet">Code Snippet</Label>
                    <Textarea id="code-snippet" placeholder="Paste your code here..." className="min-h-[200px] font-mono" />
                  </div>
                </TabsContent>
              </Tabs>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Content</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleImproveWriting}
                        disabled={isImproving || !content}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isImproving ? 'Improving...' : 'Improve Writing'}
                      </Button>
                    </div>
                    <div className="rounded-md border border-input">
                      <div className="flex items-center gap-1 p-2 border-b">
                        <Button type="button" variant="ghost" size="icon" title="Heading 1" onClick={() => applyMarkdown('# ', true)}><Heading1 className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" title="Heading 2" onClick={() => applyMarkdown('## ', true)}><Heading2 className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" title="Heading 3" onClick={() => applyMarkdown('### ', true)}><Heading3 className="h-4 w-4" /></Button>
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        <Button type="button" variant="ghost" size="icon" title="Bold" onClick={() => applyMarkdown('**')}><Bold className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" title="Italic" onClick={() => applyMarkdown('*')}><Italic className="h-4 w-4" /></Button>
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        <Button type="button" variant="ghost" size="icon" title="Bulleted List" onClick={() => applyMarkdown('- ', true)}><List className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" title="Numbered List" onClick={() => applyMarkdown('1. ', true)}><ListOrdered className="h-4 w-4" /></Button>
                         <Separator orientation="vertical" className="h-6 mx-1" />
                        <Button type="button" variant="ghost" size="icon" title="Divider" onClick={insertDivider}><Minus className="h-4 w-4" /></Button>
                      </div>
                      <FormControl>
                        <Textarea
                          ref={textareaRef}
                          placeholder="Start writing your masterpiece... (Markdown is supported)"
                          className="min-h-[400px] text-base border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Art History, Physics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Renaissance, Quantum Mechanics" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">Save Draft</Button>
                <Button type="submit">Publish</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
