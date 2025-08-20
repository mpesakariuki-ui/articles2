'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  Brain, 
  BookOpen, 
  MessageSquare, 
  Target, 
  Search, 
  Bookmark, 
  Globe, 
  Users, 
  Zap,
  Heart,
  Shield
} from 'lucide-react';

export default function AboutPage() {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    if (summary) {
      setShowSummary(true);
      return;
    }
    
    setLoading(true);
    setShowSummary(true);
    
    try {
      const response = await fetch('/api/ai/summarize-about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      setSummary(data.summary || 'Summary not available');
    } catch (error) {
      setSummary('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4">
          About Pillar Page
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          An AI-powered knowledge platform designed to enhance your reading and learning experience
        </p>
        <Button onClick={generateSummary} className="animate-pulse">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Summary of This Page
        </Button>
      </div>

      <Separator className="my-8" />

      <section className="mb-12">
        <h2 className="font-headline text-3xl font-bold mb-6 flex items-center">
          <Heart className="mr-3 h-7 w-7 text-primary" />
          Our Mission
        </h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed">
              Pillar Page is dedicated to revolutionizing how people consume and interact with written content. 
              We believe that artificial intelligence can make knowledge more accessible, engaging, and personalized 
              for every reader. Our platform combines cutting-edge AI technology with intuitive design to create 
              a reading experience that adapts to your needs and enhances your understanding.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      <section className="mb-12">
        <h2 className="font-headline text-3xl font-bold mb-6 flex items-center">
          <Zap className="mr-3 h-7 w-7 text-primary" />
          AI-Powered Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Smart Summaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Get instant AI-generated summaries of articles to quickly understand key points and decide what to read in depth.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Interactive Q&A
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ask questions about any article and get intelligent answers. Perfect for clarifying concepts and deeper understanding.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Text Highlighting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Highlight any text to get instant AI explanations and relevant references. Learn as you read with contextual insights.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Reading Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discover personalized article suggestions based on your reading history and interests. Never run out of engaging content.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary" />
                Smart Bookmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>AI identifies and highlights the most important passages worth saving. Build your knowledge base effortlessly.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Reference Finder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Automatically find online sources and URLs for article references. Access original materials with one click.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="mb-12">
        <h2 className="font-headline text-3xl font-bold mb-6 flex items-center">
          <Users className="mr-3 h-7 w-7 text-primary" />
          Community Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Interactive Comments</h3>
              <p>Engage with other readers through thoughtful discussions and share insights on articles.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">AI Chat Assistant</h3>
              <p>Get help from our AI assistant to understand site features and discover relevant content.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold">User Profiles</h3>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
              <p>Create personalized profiles to track reading history and connect with other readers.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold">Reading Groups</h3>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
              <p>Join or create reading groups to discuss articles with like-minded individuals.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="mb-12">
        <h2 className="font-headline text-3xl font-bold mb-6 flex items-center">
          <BookOpen className="mr-3 h-7 w-7 text-primary" />
          Content Topics
        </h2>
        <Card>
          <CardContent className="p-6">
            <p className="mb-4 text-muted-foreground">
              Discover a wide range of topics and subjects covered on our platform:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Badge variant="outline">Technology</Badge>
              <Badge variant="outline">Science</Badge>
              <Badge variant="outline">Philosophy</Badge>
              <Badge variant="outline">Arts & Culture</Badge>
              <Badge variant="outline">History</Badge>
              <Badge variant="outline">Psychology</Badge>
              <Badge variant="outline">Literature</Badge>
              <Badge variant="outline">Business</Badge>
              <Badge variant="outline">Health & Wellness</Badge>
              <Badge variant="outline">Education</Badge>
              <Badge variant="outline">Environment</Badge>
              <Badge variant="outline">Social Issues</Badge>
              <Badge variant="outline">Innovation</Badge>
              <Badge variant="outline">Research</Badge>
              <Badge variant="outline">Creative Writing</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      <section className="mb-12">
        <h2 className="font-headline text-3xl font-bold mb-6 flex items-center">
          <Shield className="mr-3 h-7 w-7 text-primary" />
          Privacy & Security
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="leading-relaxed">
                We take your privacy seriously. All AI processing is done securely, and we don't store personal 
                reading data beyond what's necessary to provide our services. Your interactions with our AI features 
                are processed in real-time and not used to train models or shared with third parties.
              </p>
              <p className="leading-relaxed">
                <strong>Email Privacy:</strong> User emails are never shared with any third-party companies or organizations. 
                Your email is used solely for authentication and account management purposes.
              </p>
              <p className="leading-relaxed">
                <strong>Anonymous Access:</strong> You can access and read all articles without signing up or logging in. 
                Registration is only required for interactive features like commenting and personalized recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Summary
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <h4 className="font-medium">About Pillar Page</h4>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}