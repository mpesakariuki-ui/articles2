'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { improveWritingStyle } from '@/ai/flows/improve-writing-style';
import { useToast } from '@/hooks/use-toast';

export function PostEditor() {
  const [content, setContent] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();

  const handleImproveWriting = async () => {
    if (!content) return;
    setIsImproving(true);
    try {
      const result = await improveWritingStyle({ text: content });
      setContent(result.improvedText);
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter a compelling title" className="text-lg" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="content">Content</Label>
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
              <Textarea
                id="content"
                placeholder="Start writing your masterpiece..."
                className="min-h-[400px] text-base"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Art History, Physics" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" placeholder="e.g., Renaissance, Quantum Mechanics" />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">Save Draft</Button>
              <Button type="submit">Publish</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
