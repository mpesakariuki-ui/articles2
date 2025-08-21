'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Quote, Star, MessageSquare } from 'lucide-react';
import { ExportModal } from './export-modal';
import { CitationModal } from './citation-modal';
import { PeerReviewModal } from './peer-review-modal';
import { VersionControl } from './version-control';
import { PlagiarismChecker } from './plagiarism-checker';
import { ReferenceValidator } from './reference-validator';

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  institution: string;
  keywords: string[];
  introduction: string;
  methodology: string;
  results: string;
  discussion: string;
  conclusion: string;
  references: string;
  createdAt: string;
  citations: number;
  downloads: number;
}

export function ResearchPaperView({ paper }: { paper: ResearchPaper }) {
  const [showExport, setShowExport] = useState(false);
  const [showCitation, setShowCitation] = useState(false);
  const [showReview, setShowReview] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold mb-4">{paper.title}</h1>
        {paper.doi && (
          <div className="mb-2">
            <span className="text-sm font-medium text-muted-foreground">DOI: </span>
            <span className="text-sm font-mono">{paper.doi}</span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <span><strong>Authors:</strong> {paper.authors.join(', ')}</span>
          <span><strong>Institution:</strong> {paper.institution}</span>
          <span><strong>Published:</strong> {paper.createdAt}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {paper.keywords.map(keyword => (
            <Badge key={keyword} variant="secondary">{keyword}</Badge>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          <Button onClick={() => setShowExport(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setShowCitation(true)}>
            <Quote className="h-4 w-4 mr-2" />
            Cite
          </Button>
          <Button variant="outline" onClick={() => setShowReview(true)}>
            <Star className="h-4 w-4 mr-2" />
            Review
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Abstract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{paper.abstract}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {paper.introduction.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {paper.methodology.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {paper.results.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {paper.discussion.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {paper.conclusion.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>References</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {paper.references.split('\n').filter(ref => ref.trim()).map((ref, i) => (
                <p key={i} className="text-sm">[{i + 1}] {ref}</p>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <VersionControl paperId={paper.id} />
        
        <PlagiarismChecker paperId={paper.id} content={paper.content} />
        
        <ReferenceValidator references={paper.references.split('\n').filter(r => r.trim())} paperId={paper.id} />
      </div>

      <ExportModal 
        isOpen={showExport} 
        onClose={() => setShowExport(false)} 
        paper={paper} 
      />
      <CitationModal 
        isOpen={showCitation} 
        onClose={() => setShowCitation(false)} 
        paper={paper} 
      />
      <PeerReviewModal 
        isOpen={showReview} 
        onClose={() => setShowReview(false)} 
        paperId={paper.id} 
      />
    </div>
  );
}