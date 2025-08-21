'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Lightbulb } from 'lucide-react';

interface AISectionHelperProps {
  section: string;
  currentContent: string;
  onSuggestion: (suggestion: string) => void;
}

export function AISectionHelper({ section, currentContent, onSuggestion }: AISectionHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const getSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/research-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, currentContent })
      });
      
      const data = await response.json();
      setSuggestion(data.suggestion || 'No suggestions available');
    } catch (error) {
      setSuggestion('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = () => {
    onSuggestion(suggestion);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setIsOpen(true);
          getSuggestion();
        }}
        className="mb-2"
      >
        <Sparkles className="h-4 w-4 mr-1" />
        AI Help
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Suggestions for {section}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Generating suggestions...</p>
              </div>
            ) : (
              <>
                <Textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={applySuggestion}>
                    Apply Suggestion
                  </Button>
                  <Button variant="outline" onClick={() => getSuggestion()}>
                    Regenerate
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}