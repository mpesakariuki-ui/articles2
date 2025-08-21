'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface PlagiarismCheckerProps {
  paperId: string;
  content: string;
}

export function PlagiarismChecker({ paperId, content }: PlagiarismCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ score: number; matches: any[] } | null>(null);

  const checkPlagiarism = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/research/plagiarism-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId, content })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Plagiarism check failed:', error);
    } finally {
      setChecking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 10) return 'text-green-600';
    if (score < 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score < 10) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score < 25) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Plagiarism Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result ? (
          <Button onClick={checkPlagiarism} disabled={checking}>
            {checking ? 'Checking...' : 'Run Plagiarism Check'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getScoreIcon(result.score)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Similarity Score</span>
                  <span className={`font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </span>
                </div>
                <Progress value={result.score} className="h-2" />
              </div>
            </div>
            
            {result.matches.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Similar Content Found:</h4>
                <div className="space-y-2">
                  {result.matches.map((match, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      <p className="font-medium">{match.source}</p>
                      <p className="text-muted-foreground">Similarity: {match.percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button variant="outline" onClick={() => setResult(null)}>
              Check Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}