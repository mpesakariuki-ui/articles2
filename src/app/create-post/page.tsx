'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, X, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, List, Type, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

export default function CreatePostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [grammarCheck, setGrammarCheck] = useState('');
  const [citations, setCitations] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [references, setReferences] = useState<string[]>(['']);
  const [resources, setResources] = useState<string[]>(['']);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file.',
        variant: 'destructive'
      });
      return;
    }

    setImageUploading(true);
    try {
      // For demo purposes, use a placeholder image service
      const imageUrl = `https://placehold.co/600x400.png?text=${encodeURIComponent(file.name)}`;
      insertText(`![${file.name}](${imageUrl})`, '');
      toast({
        title: 'Image added',
        description: 'Image has been inserted into your post.'
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setImageUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const getAISuggestions = async () => {
    if (!title.trim()) {
      toast({ title: 'Enter a title first', description: 'Please add a title to get AI suggestions.' });
      return;
    }
    
    setLoadingAI(true);
    try {
      const response = await fetch('/api/ai/writing-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content })
      });
      
      const data = await response.json();
      setAiSuggestions(data.suggestions || '');
      toast({ title: 'AI suggestions ready!', description: 'Check the suggestions panel below.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to get AI suggestions.', variant: 'destructive' });
    } finally {
      setLoadingAI(false);
    }
  };

  const checkGrammar = async () => {
    if (!content.trim()) {
      toast({ title: 'No content to check', description: 'Please write some content first.' });
      return;
    }
    
    setLoadingAI(true);
    try {
      const response = await fetch('/api/ai/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      const data = await response.json();
      setGrammarCheck(data.feedback || '');
      toast({ title: 'Grammar check complete!', description: 'Review suggestions below.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to check grammar.', variant: 'destructive' });
    } finally {
      setLoadingAI(false);
    }
  };

  const getCitations = async () => {
    if (!title.trim() && !content.trim()) {
      toast({ title: 'Add content first', description: 'Please add a title or content to find citations.' });
      return;
    }
    
    setLoadingAI(true);
    try {
      const response = await fetch('/api/ai/citations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: content.slice(0, 500) })
      });
      
      const data = await response.json();
      setCitations(data.citations || []);
      toast({ title: 'Citations found!', description: 'APA citations are ready to use.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to find citations.', variant: 'destructive' });
    } finally {
      setLoadingAI(false);
    }
  };

  const addReference = () => {
    setReferences([...references, '']);
  };

  const updateReference = (index: number, value: string) => {
    const newReferences = [...references];
    newReferences[index] = value;
    setReferences(newReferences);
  };

  const removeReference = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const addResource = () => {
    setResources([...resources, '']);
  };

  const updateResource = (index: number, value: string) => {
    const newResources = [...resources];
    newResources[index] = value;
    setResources(newResources);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file.',
        variant: 'destructive'
      });
      return;
    }

    setThumbnailUploading(true);
    try {
      // For demo purposes, use a placeholder image service
      const imageUrl = `https://placehold.co/800x400.png?text=${encodeURIComponent(file.name)}`;
      setThumbnailUrl(imageUrl);
      toast({
        title: 'Thumbnail uploaded',
        description: 'Thumbnail image has been set for your post.'
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload thumbnail. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setThumbnailUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const saveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please add a title to save as draft.',
        variant: 'destructive'
      });
      return;
    }

    setSavingDraft(true);
    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim() || 'Draft content...',
          excerpt: excerpt.trim() || 'Draft excerpt...',
          category: category || 'Uncategorized',
          tags,
          references: references.filter(ref => ref.trim()),
          resources: resources.filter(res => res.trim()),
          coverImage: thumbnailUrl || 'https://placehold.co/800x400.png',
          status: 'draft',
          author: {
            name: user.displayName || 'Anonymous',
            email: user.email,
            avatarUrl: user.photoURL || 'https://placehold.co/100x100.png'
          }
        })
      });

      if (response.ok) {
        toast({
          title: 'Draft saved!',
          description: 'Your post has been saved as a draft.'
        });
      } else {
        throw new Error('Failed to save draft');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSavingDraft(false);
    }
  };

  const clearForm = () => {
    if (confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
      setTitle('');
      setContent('');
      setExcerpt('');
      setCategory('');
      setTags([]);
      setReferences(['']);
      setResources(['']);
      setThumbnailUrl('');
      setAiSuggestions('');
      setGrammarCheck('');
      setCitations([]);
      toast({ title: 'Form cleared', description: 'All content has been cleared.' });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-4">
              You need to sign in to create a post.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const insertText = (before: string, after: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in title, content, and category.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || content.slice(0, 200) + '...',
          category,
          tags,
          references: references.filter(ref => ref.trim()),
          resources: resources.filter(res => res.trim()),
          coverImage: thumbnailUrl || 'https://placehold.co/800x400.png',
          status: 'published',
          author: {
            name: user.displayName || 'Anonymous',
            email: user.email,
            avatarUrl: user.photoURL || 'https://placehold.co/100x100.png'
          }
        })
      });

      if (response.ok) {
        const { postId } = await response.json();
        toast({
          title: 'Post created successfully!',
          description: 'Your post is now live.'
        });
        router.push(`/posts/${postId}`);
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6" />
            Create New Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Brief description (optional - will auto-generate if empty)"
                rows={3}
              />
            </div>

            <div>
              <Label>Thumbnail Image</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={thumbnailUploading}
                    />
                    <Button type="button" variant="outline" disabled={thumbnailUploading}>
                      <Image className="h-4 w-4 mr-2" />
                      {thumbnailUploading ? 'Uploading...' : 'Upload Thumbnail'}
                    </Button>
                  </div>
                  {thumbnailUrl && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setThumbnailUrl('')}>
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                {thumbnailUrl && (
                  <div className="border rounded-lg p-2">
                    <img 
                      src={thumbnailUrl} 
                      alt="Thumbnail preview" 
                      className="w-full max-w-md h-48 object-cover rounded"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload a thumbnail image for your post. Recommended size: 800x400px.
                </p>
              </div>
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
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <div className="border rounded-md">
                <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
                  {/* Text Formatting */}
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('**', '**')} title="Bold">
                    <strong>B</strong>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('*', '*')} title="Italic">
                    <em>I</em>
                  </Button>
                  
                  {/* Headings */}
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('# ', '')} title="Heading 1">
                    H1
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('## ', '')} title="Heading 2">
                    H2
                  </Button>
                  
                  {/* Lists */}
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('- ', '')} title="Bullet List">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('1. ', '')} title="Numbered List">
                    1.
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('• ', '')} title="Bullet Point">
                    •
                  </Button>
                  
                  {/* Structure */}
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('\n---\n', '')} title="Divider">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('\n\n', '')} title="New Paragraph">
                    <Type className="h-4 w-4" />
                  </Button>
                  
                  {/* Content */}
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('[Link](', ')')} title="Link">
                    Link
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('> ', '')} title="Quote">
                    Quote
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('`', '`')} title="Code">
                    Code
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={imageUploading}
                    />
                    <Button type="button" variant="ghost" size="sm" disabled={imageUploading}>
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('<div style="text-align: left;">', '</div>')}>
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('<div style="text-align: center;">', '</div>')}>
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('<div style="text-align: right;">', '</div>')}>
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertText('<div style="text-align: justify;">', '</div>')}>
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                  <div className="ml-auto">
                    <Button 
                      type="button" 
                      variant={showPreview ? "default" : "ghost"} 
                      size="sm" 
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                </div>
                {showPreview ? (
                  <div className="p-4 min-h-[500px] prose prose-sm max-w-none">
                    {content ? (
                      content.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
                        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-5 mb-2">{line.slice(3)}</h2>;
                        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
                        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-muted pl-4 italic">{line.slice(2)}</blockquote>;
                        return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ 
                          __html: line
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded">$1</code>')
                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
                        }} />;
                      })
                    ) : (
                      <p className="text-muted-foreground">Nothing to preview yet. Start writing your content!</p>
                    )}
                  </div>
                ) : (
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here...\n\nUse the toolbar above for formatting:\n• **Bold** and *Italic* text\n• # H1 and ## H2 headings\n• - Bullet lists and 1. Numbered lists\n• • Bullet points and --- dividers\n• New paragraphs and [Links](url)\n• > Quotes and `Code`\n• Images and text alignment"
                    rows={20}
                    className="border-0 resize-none focus-visible:ring-0"
                    required
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use the toolbar buttons above to format your text easily. Includes bullets, numbered lists, dividers, paragraphs, images, and alignment. Supports Markdown syntax.
              </p>
            </div>

            <div>
              <Label>References</Label>
              <div className="space-y-2">
                {references.map((ref, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ref}
                      onChange={(e) => updateReference(index, e.target.value)}
                      placeholder="Add a reference (URL, book, article, etc.)"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeReference(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addReference}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Reference
                </Button>
              </div>
            </div>

            <div>
              <Label>Resources</Label>
              <div className="space-y-2">
                {resources.map((res, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={res}
                      onChange={(e) => updateResource(index, e.target.value)}
                      placeholder="Add a resource (website, tool, dataset, etc.)"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeResource(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addResource}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
                <Button type="button" variant="outline" size="sm" onClick={getAISuggestions} disabled={loadingAI}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI Suggestions
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={checkGrammar} disabled={loadingAI}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Grammar Check
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={getCitations} disabled={loadingAI}>
                  <BookOpen className="h-4 w-4 mr-1" />
                  Find Citations
                </Button>
              </div>
              
              {aiSuggestions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Writing Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiSuggestions}</p>
                  </CardContent>
                </Card>
              )}
              
              {grammarCheck && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Grammar & Style Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{grammarCheck}</p>
                  </CardContent>
                </Card>
              )}
              
              {citations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      APA Citations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {citations.map((citation, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-xs font-mono">
                          {citation}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSubmitting || savingDraft}>
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
                <Button type="button" variant="outline" onClick={saveDraft} disabled={isSubmitting || savingDraft}>
                  {savingDraft ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button type="button" variant="ghost" onClick={clearForm} disabled={isSubmitting || savingDraft}>
                  Clear All
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/')} disabled={isSubmitting || savingDraft}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}