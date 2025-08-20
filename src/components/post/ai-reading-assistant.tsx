'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, HelpCircle, Lightbulb, BookOpen, X } from 'lucide-react';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

interface AIAssistantProps {
  articleContent: string;
  articleTitle: string;
  onClose: () => void;
}

export function AIReadingAssistant({ articleContent, articleTitle, onClose }: AIAssistantProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [discussions, setDiscussions] = useState<string[]>([]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        prompt: `Based on this article titled "${articleTitle}":

${articleContent.slice(0, 2000)}...

Answer this question: ${question}

Provide a clear, concise answer based on the article content.`,
      });
      
      setResponse(text);
    } catch (error) {
      setResponse('Sorry, I couldn\'t process your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const explainConcept = async (concept: string) => {
    setLoading(true);
    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        prompt: `Explain the concept "${concept}" in simple terms, in the context of this article: "${articleTitle}". Keep it brief and easy to understand.`,
      });
      
      setResponse(text);
    } catch (error) {
      setResponse('Sorry, I couldn\'t explain this concept. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateDiscussions = async () => {
    setLoading(true);
    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        prompt: `Based on the article "${articleTitle}", generate 3 thought-provoking discussion questions that would engage readers. Format as a simple list.`,
      });
      
      const questions = text.split('\n').filter(line => line.trim()).slice(0, 3);
      setDiscussions(questions);
    } catch (error) {
      setDiscussions(['What did you find most interesting about this article?']);
    } finally {
      setLoading(false);
    }
  };

  const extractConcepts = async () => {
    setLoading(true);
    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        prompt: `Extract 5 key concepts or terms from this article that readers might want explained: "${articleContent.slice(0, 1000)}". Return only the terms, separated by commas.`,
      });
      
      const conceptList = text.split(',').map(c => c.trim()).slice(0, 5);
      setConcepts(conceptList);
    } catch (error) {
      setConcepts(['Renaissance', 'Art', 'Science']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-40 right-4 w-80 max-h-[70vh] overflow-y-auto z-30 bg-background border rounded-lg shadow-lg">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">AI Assistant</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
      <CardContent className="space-y-6">
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
              <BookOpen className="h-4 w-4" />
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