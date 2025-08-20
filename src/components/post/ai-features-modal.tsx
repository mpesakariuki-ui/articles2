'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, HelpCircle, Lightbulb, BookOpen, X, Sparkles } from 'lucide-react';


interface AIFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleContent: string;
  articleTitle: string;
}

export function AIFeaturesModal({ isOpen, onClose, articleContent, articleTitle }: AIFeaturesModalProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [discussions, setDiscussions] = useState<string[]>([]);

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent, title: articleTitle })
      });
      const data = await response.json();
      setSummary(data.summary || 'Sorry, I couldn\'t generate a summary.');
    } catch (error) {
      setSummary('Sorry, I couldn\'t generate a summary. Please try again.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent, title: articleTitle, question })
      });
      const data = await response.json();
      setResponse(data.answer || 'Sorry, I couldn\'t process your question.');
    } catch (error) {
      setResponse('Sorry, I couldn\'t process your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const explainConcept = async (concept: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/explain-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, title: articleTitle })
      });
      const data = await response.json();
      setResponse(data.explanation || 'Sorry, I couldn\'t explain this concept.');
    } catch (error) {
      setResponse('Sorry, I couldn\'t explain this concept. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateDiscussions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent, title: articleTitle })
      });
      const data = await response.json();
      setDiscussions(data.questions || ['What did you find most interesting about this article?']);
    } catch (error) {
      setDiscussions(['What did you find most interesting about this article?']);
    } finally {
      setLoading(false);
    }
  };

  const extractConcepts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/extract-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent })
      });
      const data = await response.json();
      setConcepts(data.concepts || ['Key concept', 'Important term']);
    } catch (error) {
      setConcepts(['Key concept', 'Important term']);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto m-2 md:m-4 bg-background">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Features
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Article Summary
              </h4>
              <Button variant="outline" size="sm" onClick={generateSummary} disabled={loadingSummary}>
                {loadingSummary ? 'Generating...' : 'Generate Summary'}
              </Button>
            </div>
            {loadingSummary && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
            )}
            {summary && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{summary}</p>
              </div>
            )}
          </div>

          {/* Ask Questions */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Ask About This Article
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder="What would you like to know about this article?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
              />
              <Button onClick={askQuestion} disabled={loading}>
                Ask
              </Button>
            </div>
            {response && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{response}</p>
              </div>
            )}
          </div>

          {/* Concept Explanation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Key Concepts
              </h4>
              <Button variant="outline" size="sm" onClick={extractConcepts} disabled={loading}>
                Find Concepts
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {concepts.map((concept, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => explainConcept(concept)}
                >
                  {concept}
                </Badge>
              ))}
            </div>
          </div>

          {/* Discussion Starters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Discussion Starters
              </h4>
              <Button variant="outline" size="sm" onClick={generateDiscussions} disabled={loading}>
                Generate Topics
              </Button>
            </div>
            <div className="space-y-2">
              {discussions.map((discussion, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="text-sm">{discussion}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}