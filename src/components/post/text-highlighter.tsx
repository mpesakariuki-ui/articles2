'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, X, ExternalLink } from 'lucide-react';

interface HighlightPopupProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
}

function HighlightPopup({ selectedText, position, onClose }: HighlightPopupProps) {
  const [explanation, setExplanation] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardPosition, setCardPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragOffset({
      x: clientX - cardPosition.x,
      y: clientY - cardPosition.y
    });
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      setCardPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const explainText = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/explain-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText })
      });
      
      const data = await response.json();
      setExplanation(data.explanation || 'No explanation available');
      setReferences(data.references || []);
    } catch (error) {
      setExplanation('Failed to generate explanation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    explainText();
  }, [selectedText]);

  return (
    <Card 
      className="fixed z-50 w-[500px] md:w-[500px] sm:w-[90vw] shadow-lg border cursor-move"
      style={{ 
        left: window.innerWidth < 640 ? '5vw' : Math.min(cardPosition.x, window.innerWidth - 500),
        top: Math.min(cardPosition.y + 10, window.innerHeight - 200),
        maxWidth: window.innerWidth < 640 ? '90vw' : '500px'
      }}
      onMouseDown={handleMouseDown}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3 cursor-move" onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">AI Explanation</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-3 p-2 bg-muted rounded text-xs italic">
          "{selectedText.length > 100 ? selectedText.slice(0, 100) + '...' : selectedText}"
        </div>
        
        <div className="max-h-48 overflow-y-auto">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <p className="text-sm mb-3">{explanation}</p>
              {references.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2">References:</p>
                  <div className="space-y-1">
                    {references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {ref.length > 40 ? ref.slice(0, 40) + '...' : ref}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TextHighlighter({ children }: { children: React.ReactNode }) {
  const [selectedText, setSelectedText] = useState('');
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 10) {
        const text = selection.toString().trim();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectedText(text);
        setPopupPosition({ x: rect.left, y: rect.bottom });
        setShowPopup(true);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
      {showPopup && (
        <HighlightPopup
          selectedText={selectedText}
          position={popupPosition}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}