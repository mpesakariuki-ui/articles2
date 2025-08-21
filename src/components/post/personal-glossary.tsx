'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface GlossaryTerm {
  term: string;
  definition: string;
  context: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

interface PersonalGlossaryProps {
  content: string;
  title: string;
}

export function PersonalGlossary({ content, title }: PersonalGlossaryProps) {
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { ref, isVisible } = useScrollReveal();

  const buildGlossary = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/build-glossary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      });
      
      const data = await response.json();
      setGlossaryTerms(data.terms || []);
    } catch (error) {
      console.error('Error building glossary:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportGlossary = () => {
    const glossaryText = glossaryTerms.map(term => 
      `${term.term}: ${term.definition}\nContext: ${term.context}\n`
    ).join('\n');
    
    const blob = new Blob([glossaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-glossary.txt`;
    a.click();
    
    toast({ title: 'Glossary exported successfully!' });
  };

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Personal Glossary
        </CardTitle>
        <div className="flex gap-2">
          {glossaryTerms.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportGlossary}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={buildGlossary} disabled={loading}>
            <Sparkles className="h-4 w-4 mr-1" />
            {loading ? 'Building...' : 'Build Glossary'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto">
          {glossaryTerms.length > 0 ? (
            <div className="space-y-4">
              {glossaryTerms.map((term, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{term.term}</h4>
                    <Badge variant={
                      term.difficulty === 'Basic' ? 'secondary' :
                      term.difficulty === 'Intermediate' ? 'default' : 'destructive'
                    }>
                      {term.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{term.definition}</p>
                  <p className="text-xs text-muted-foreground italic">
                    Context: {term.context}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              AI will extract key terms and build your personal vocabulary from this article.
            </p>
          )}
        </div>
      </CardContent>
      </Card>
    </div>
  );
}