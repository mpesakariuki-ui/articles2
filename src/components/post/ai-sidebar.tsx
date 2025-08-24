'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, HelpCircle, Lightbulb, BookOpen, Sparkles, ChevronLeft, ChevronRight, Bookmark, Copy, Target } from 'lucide-react';

interface AISidebarProps {
  articleContent: string;
  articleTitle: string;
}

export function AISidebar({ articleContent, articleTitle }: AISidebarProps) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [discussions, setDiscussions] = useState<string[]>([]);
  const [keyPassages, setKeyPassages] = useState<any[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent, title: articleTitle, userId: user?.uid })
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
        body: JSON.stringify({ content: articleContent, title: articleTitle, question, userId: user?.uid })
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
        body: JSON.stringify({ concept, title: articleTitle, userId: user?.uid })
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
        body: JSON.stringify({ content: articleContent, title: articleTitle, userId: user?.uid })
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
        body: JSON.stringify({ content: articleContent, userId: user?.uid })
      });
      const data = await response.json();
      setConcepts(data.concepts || ['Key concept', 'Important term']);
    } catch (error) {
      setConcepts(['Key concept', 'Important term']);
    } finally {
      setLoading(false);
    }
  };

  const identifyKeyPassages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/identify-passages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent, title: articleTitle, userId: user?.uid })
      });
      const data = await response.json();
      setKeyPassages(data.passages || []);
    } catch (error) {
      setKeyPassages([]);
    } finally {
      setLoading(false);
    }
  };

  const buildGlossary = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/build-glossary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent, title: articleTitle, userId: user?.uid })
      });
      const data = await response.json();
      setGlossaryTerms(data.terms || []);
    } catch (error) {
      setGlossaryTerms([]);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/reading-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPost: {
            title: articleTitle,
            content: articleContent.slice(0, 1000),
            category: 'General',
            tags: []
          },
          userId: user?.uid
        })
      });
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`absolute left-0 top-0 h-full bg-background border-r transition-all duration-300 z-40 ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      {/* Collapse/Expand Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-20 z-50 h-8 w-8 rounded-full border bg-background shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Sidebar Content */}
      <div className={`h-screen overflow-y-auto p-4 sticky top-0 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="mb-4">
          <h3 className="font-semibold flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            AI Features
          </h3>
        </div>

        <div className="space-y-4">
          {/* AI Summary */}
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-3 w-3" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateSummary} 
                disabled={loadingSummary}
                className="w-full text-xs h-7"
              >
                {loadingSummary ? 'Generating...' : 'Generate'}
              </Button>
              {loadingSummary && (
                <div className="space-y-1">
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-2 w-4/5" />
                </div>
              )}
              {summary && (
                <div className="p-2 bg-muted rounded text-xs max-h-20 overflow-y-auto">
                  {summary}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ask Questions */}
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="h-3 w-3" />
                Ask Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="Ask about this article..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                className="text-xs h-7"
              />
              <Button 
                onClick={askQuestion} 
                disabled={loading}
                size="sm"
                className="w-full text-xs h-7"
              >
                Ask
              </Button>
              {response && (
                <div className="p-2 bg-muted rounded text-xs max-h-20 overflow-y-auto">
                  {response}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Concepts */}
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                Concepts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={extractConcepts} 
                disabled={loading}
                className="w-full text-xs h-7"
              >
                Find Concepts
              </Button>
              <div className="flex flex-wrap gap-1">
                {concepts.map((concept, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs px-1 py-0"
                    onClick={() => explainConcept(concept)}
                  >
                    {concept}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discussion Starters */}
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-3 w-3" />
                Discussions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateDiscussions} 
                disabled={loading}
                className="w-full text-xs h-7"
              >
                Generate Topics
              </Button>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {discussions.map((discussion, index) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    {discussion}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Bookmarks */}
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bookmark className="h-3 w-3" />
                Bookmarks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={identifyKeyPassages} 
                disabled={loading}
                className="w-full text-xs h-7"
              >
                Find Key Passages
              </Button>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {keyPassages.map((passage, index) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" className="text-xs px-1 py-0">{passage.importance}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigator.clipboard.writeText(passage.text)}
                        className="h-4 w-4 p-0"
                      >
                        <Copy className="h-2 w-2" />
                      </Button>
                    </div>
                    <p className="text-xs italic mb-1">"{passage.text?.slice(0, 50)}..."</p>
                    <p className="text-xs text-muted-foreground">{passage.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal Glossary */}
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-3 w-3" />
                Glossary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={buildGlossary} 
                disabled={loading}
                className="w-full text-xs h-7"
              >
                Build Glossary
              </Button>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {glossaryTerms.map((term, index) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs">{term.term}</span>
                      <Badge 
                        variant={term.difficulty === 'Basic' ? 'secondary' : term.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                        className="text-xs px-1 py-0"
                      >
                        {term.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs mb-1">{term.definition}</p>
                    <p className="text-xs text-muted-foreground italic">{term.context}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reading Recommendations */}
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-3 w-3" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateRecommendations} 
                disabled={loading}
                className="w-full text-xs h-7"
              >
                Get Recommendations
              </Button>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    <p className="font-semibold text-xs mb-1">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.excerpt?.slice(0, 60)}...</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}