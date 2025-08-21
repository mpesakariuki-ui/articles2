'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Lightbulb } from 'lucide-react';

interface AISidebarHelperProps {
  onSuggestion: (section: string, suggestion: string) => void;
}

export function AISidebarHelper({ onSuggestion }: AISidebarHelperProps) {
  const [activeSection, setActiveSection] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const sections = [
    { key: 'abstract', label: 'Abstract' },
    { key: 'introduction', label: 'Introduction' },
    { key: 'methodology', label: 'Methodology' },
    { key: 'results', label: 'Results' },
    { key: 'discussion', label: 'Discussion' },
    { key: 'conclusion', label: 'Conclusion' },
    { key: 'references', label: 'References' }
  ];

  const getSuggestion = async (section: string) => {
    setActiveSection(section);
    setLoading(true);
    try {
      const response = await fetch('/api/ai/research-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, currentContent: '' })
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
    onSuggestion(activeSection, suggestion);
    setSuggestion('');
    setActiveSection('');
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Writing Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((section) => (
          <Button
            key={section.key}
            variant="outline"
            size="sm"
            onClick={() => getSuggestion(section.key)}
            className="w-full justify-start"
            disabled={loading}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {section.label}
          </Button>
        ))}
        
        {activeSection && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium">Suggestions for {sections.find(s => s.key === activeSection)?.label}</h4>
            {loading ? (
              <div className="text-center py-4">
                <Sparkles className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">Generating...</p>
              </div>
            ) : (
              <>
                <Textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  rows={6}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={applySuggestion} size="sm">
                    Apply
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => getSuggestion(activeSection)}>
                    Regenerate
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}