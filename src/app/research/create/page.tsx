'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText, Save } from 'lucide-react';
import { CoAuthorManager } from '@/components/research/co-author-manager';
import { AISectionHelper } from '@/components/research/ai-section-helper';

interface CoAuthor {
  email: string;
  name: string;
  institution?: string;
}

export default function CreateResearchPage() {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    institution: '',
    keywords: '',
    introduction: '',
    methodology: '',
    results: '',
    discussion: '',
    conclusion: '',
    references: '',
    coAuthors: [] as CoAuthor[]
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          authors: formData.authors.split(',').map(a => a.trim()),
          keywords: formData.keywords.split(',').map(k => k.trim())
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({ title: 'Research paper submitted successfully!' });
        router.push(`/research/${data.id}`);
      } else {
        throw new Error('Failed to submit paper');
      }
    } catch (error) {
      toast({ title: 'Error submitting paper', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold mb-2 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Submit Research Paper
        </h1>
        <p className="text-muted-foreground">Submit your academic research for publication</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paper Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="authors">Authors * (comma-separated)</Label>
              <Input
                id="authors"
                value={formData.authors}
                onChange={(e) => setFormData({...formData, authors: e.target.value})}
                placeholder="John Doe, Jane Smith"
                required
              />
            </div>
            
            <CoAuthorManager 
              coAuthors={formData.coAuthors || []}
              onChange={(coAuthors) => setFormData({...formData, coAuthors})}
            />
            
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                placeholder="machine learning, AI, research"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abstract</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span></span>
              <AISectionHelper
                section="abstract"
                currentContent={formData.abstract}
                onSuggestion={(suggestion) => setFormData({...formData, abstract: suggestion})}
              />
            </div>
            <Textarea
              value={formData.abstract}
              onChange={(e) => setFormData({...formData, abstract: e.target.value})}
              placeholder="Brief summary of your research..."
              rows={4}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paper Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="introduction">Introduction</Label>
                <AISectionHelper
                  section="introduction"
                  currentContent={formData.introduction}
                  onSuggestion={(suggestion) => setFormData({...formData, introduction: suggestion})}
                />
              </div>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                rows={6}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="methodology">Methodology</Label>
                <AISectionHelper
                  section="methodology"
                  currentContent={formData.methodology}
                  onSuggestion={(suggestion) => setFormData({...formData, methodology: suggestion})}
                />
              </div>
              <Textarea
                id="methodology"
                value={formData.methodology}
                onChange={(e) => setFormData({...formData, methodology: e.target.value})}
                rows={6}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="results">Results</Label>
                <AISectionHelper
                  section="results"
                  currentContent={formData.results}
                  onSuggestion={(suggestion) => setFormData({...formData, results: suggestion})}
                />
              </div>
              <Textarea
                id="results"
                value={formData.results}
                onChange={(e) => setFormData({...formData, results: e.target.value})}
                rows={6}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="discussion">Discussion</Label>
                <AISectionHelper
                  section="discussion"
                  currentContent={formData.discussion}
                  onSuggestion={(suggestion) => setFormData({...formData, discussion: suggestion})}
                />
              </div>
              <Textarea
                id="discussion"
                value={formData.discussion}
                onChange={(e) => setFormData({...formData, discussion: e.target.value})}
                rows={6}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="conclusion">Conclusion</Label>
                <AISectionHelper
                  section="conclusion"
                  currentContent={formData.conclusion}
                  onSuggestion={(suggestion) => setFormData({...formData, conclusion: suggestion})}
                />
              </div>
              <Textarea
                id="conclusion"
                value={formData.conclusion}
                onChange={(e) => setFormData({...formData, conclusion: e.target.value})}
                rows={4}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="references">References</Label>
                <AISectionHelper
                  section="references"
                  currentContent={formData.references}
                  onSuggestion={(suggestion) => setFormData({...formData, references: suggestion})}
                />
              </div>
              <Textarea
                id="references"
                value={formData.references}
                onChange={(e) => setFormData({...formData, references: e.target.value})}
                placeholder="List your references here..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Submitting...' : 'Submit Paper'}
          </Button>
        </div>
      </form>
    </div>
  );
}