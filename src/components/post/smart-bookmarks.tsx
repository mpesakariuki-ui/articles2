'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Sparkles, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface SmartBookmarksProps {
  content: string;
  title: string;
}

interface KeyPassage {
  text: string;
  importance: string;
  reason: string;
}

export function SmartBookmarks({ content, title }: SmartBookmarksProps) {
  const [keyPassages, setKeyPassages] = useState<KeyPassage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { ref, isVisible } = useScrollReveal();

  const identifyKeyPassages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/identify-passages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      });
      
      const data = await response.json();
      setKeyPassages(data.passages || []);
    } catch (error) {
      console.error('Error identifying passages:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyPassage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Passage copied to clipboard!' });
  };

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Smart Bookmarks
        </CardTitle>
        <Button variant="outline" size="sm" onClick={identifyKeyPassages} disabled={loading}>
          <Sparkles className="h-4 w-4 mr-1" />
          {loading ? 'Analyzing...' : 'Find Key Passages'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto">
          {keyPassages.length > 0 ? (
            <div className="space-y-4">
              {keyPassages.map((passage, index) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{passage.importance}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => copyPassage(passage.text)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm mb-2 italic">"{passage.text}"</p>
                  <p className="text-xs text-muted-foreground">{passage.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              AI will identify the most important passages worth bookmarking.
            </p>
          )}
        </div>
      </CardContent>
      </Card>
    </div>
  );
}