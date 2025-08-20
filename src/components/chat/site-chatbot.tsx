'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Bot, ExternalLink } from 'lucide-react';
import type { Post } from '@/lib/types';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  urls?: string[];
}

interface SiteChatbotProps {
  posts: Post[];
}

export function SiteChatbot({ posts }: SiteChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant for Pillar Page. I can explain our site's theme, discuss posts, and share article URLs. What would you like to know?",
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/site-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          posts: posts.map(p => ({ title: p.title, id: p.id, category: p.category }))
        })
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I could not process your request.',
        isBot: true,
        urls: data.urls || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 rounded-full w-12 h-12 md:w-14 md:h-14 shadow-lg animate-pulse touch-manipulation"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-md max-h-[85vh] md:max-h-[80vh] flex flex-col m-2 md:m-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
              <Bot className="h-4 w-4 md:h-5 md:w-5" />
              Pillar Page Assistant
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 p-2 md:p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.isBot ? <Bot className="h-4 w-4" /> : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Card className={`max-w-[80%] ${message.isBot ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.text}</p>
                    {message.urls && message.urls.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {url.replace(typeof window !== 'undefined' ? window.location.origin : '', '')}
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-muted">
                  <CardContent className="p-3">
                    <p className="text-sm">Thinking...</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="flex gap-2 p-4 border-t">
            <Input
              placeholder="Ask about our site or posts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}