import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Users, Calendar } from 'lucide-react';

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  institution: string;
  keywords: string[];
  createdAt: string;
  citations: number;
  downloads: number;
}

interface ResearchPaperCardProps {
  paper: ResearchPaper;
}

export function ResearchPaperCard({ paper }: ResearchPaperCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-2 mb-2">
          <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <CardTitle className="text-lg leading-tight">
            <Link href={`/research/${paper.id}`} className="hover:text-primary">
              {paper.title}
            </Link>
          </CardTitle>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{paper.authors.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{paper.createdAt}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {paper.abstract}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {paper.keywords.slice(0, 3).map(keyword => (
            <Badge key={keyword} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>{paper.citations} citations</span>
          <span>{paper.downloads} downloads</span>
        </div>
        
        <div className="flex gap-2 mt-auto">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/research/${paper.id}`}>
              View Paper
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}