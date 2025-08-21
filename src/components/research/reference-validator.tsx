'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface ReferenceValidatorProps {
  references: string[];
  paperId: string;
}

interface ValidationResult {
  reference: string;
  isValid: boolean;
  url?: string;
  error?: string;
}

export function ReferenceValidator({ references, paperId }: ReferenceValidatorProps) {
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);

  const validateReferences = async () => {
    setValidating(true);
    try {
      const response = await fetch('/api/research/validate-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ references, paperId })
      });
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Reference validation failed:', error);
    } finally {
      setValidating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Reference Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={validateReferences} disabled={validating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${validating ? 'animate-spin' : ''}`} />
          {validating ? 'Validating...' : 'Validate References'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Validation Results</span>
              <span className="text-sm text-muted-foreground">
                {results.filter(r => r.isValid).length}/{results.length} valid
              </span>
            </div>
            
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded">
                {result.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm break-words">{result.reference}</p>
                  {result.error && (
                    <p className="text-xs text-red-600 mt-1">{result.error}</p>
                  )}
                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      View Source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}