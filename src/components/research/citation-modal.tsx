'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Quote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: any;
}

export function CitationModal({ isOpen, onClose, paper }: CitationModalProps) {
  const { toast } = useToast();

  const citations = {
    apa: `${paper.authors.join(', ')} (${new Date(paper.createdAt).getFullYear()}). ${paper.title}. ${paper.institution}.`,
    mla: `${paper.authors[0]}${paper.authors.length > 1 ? ', et al.' : ''}. "${paper.title}." ${paper.institution}, ${new Date(paper.createdAt).getFullYear()}.`,
    chicago: `${paper.authors.join(', ')}. "${paper.title}." ${paper.institution}, ${new Date(paper.createdAt).getFullYear()}.`,
    bibtex: `@article{${paper.id},
  title={${paper.title}},
  author={${paper.authors.join(' and ')}},
  institution={${paper.institution}},
  year={${new Date(paper.createdAt).getFullYear()}}
}`
  };

  const copyCitation = (format: string) => {
    navigator.clipboard.writeText(citations[format as keyof typeof citations]);
    toast({ title: `${format.toUpperCase()} citation copied!` });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5" />
            Cite This Paper
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="apa">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="apa">APA</TabsTrigger>
            <TabsTrigger value="mla">MLA</TabsTrigger>
            <TabsTrigger value="chicago">Chicago</TabsTrigger>
            <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
          </TabsList>
          {Object.entries(citations).map(([format, citation]) => (
            <TabsContent key={format} value={format} className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{citation}</pre>
              </div>
              <Button onClick={() => copyCitation(format)} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy {format.toUpperCase()} Citation
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}