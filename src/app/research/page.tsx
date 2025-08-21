'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ResearchPaperCard } from '@/components/research/research-paper-card';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  institution: string;
  keywords: string[];
  content: string;
  createdAt: string;
  doi?: string;
  citations: number;
  downloads: number;
}

export default function ResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/research')
      .then(res => res.json())
      .then(data => setPapers(data.papers || []))
      .catch(() => setPapers([]));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold mb-2">Research Papers</h1>
        <p className="text-muted-foreground">Academic research and scientific publications</p>
        
        <div className="mt-6 max-w-md mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Coming Soon</h3>
            <p className="text-sm text-yellow-700">Research papers feature is currently under development. Stay tuned!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map(paper => (
          <ResearchPaperCard key={paper.id} paper={paper} />
        ))}
      </div>

      {papers.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No research papers yet</h3>
          <p className="text-muted-foreground">Be the first to submit a research paper!</p>
        </div>
      )}
    </div>
  );
}