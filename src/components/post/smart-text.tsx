'use client';

import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SmartTextProps {
  children: string;
}

export function SmartText({ children }: SmartTextProps) {
  const [definitions, setDefinitions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getDefinition = async (word: string) => {
    if (definitions[word] || loading[word]) return;
    
    setLoading(prev => ({ ...prev, [word]: true }));
    
    try {
      const response = await fetch('/api/ai/define-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      });
      
      const data = await response.json();
      setDefinitions(prev => ({ ...prev, [word]: data.definition || 'Definition not available' }));
    } catch (error) {
      setDefinitions(prev => ({ ...prev, [word]: 'Definition not available' }));
    } finally {
      setLoading(prev => ({ ...prev, [word]: false }));
    }
  };

  const processText = (text: string) => {
    const words = text.split(/(\s+)/);
    
    return (
      <TooltipProvider>
        {words.map((word, index) => {
          const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
          
          if (cleanWord.length > 4 && /^[a-zA-Z]+$/.test(cleanWord)) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span 
                    className="cursor-help hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded px-0.5 transition-colors"
                    onMouseEnter={() => getDefinition(cleanWord)}
                  >
                    {word}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <span className="text-sm">
                    {loading[cleanWord] ? 'Loading...' : definitions[cleanWord] || 'Hover to get definition'}
                  </span>
                </TooltipContent>
              </Tooltip>
            );
          }
          
          return <span key={index}>{word}</span>;
        })}
      </TooltipProvider>
    );
  };

  return <>{processText(children)}</>;
}