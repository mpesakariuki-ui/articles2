'use client';

import { Download, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Post } from '@/lib/types';

interface ExportOptionsProps {
  post: Post;
}

export function ExportOptions({ post }: ExportOptionsProps) {
  const exportAsMarkdown = () => {
    const markdown = `# ${post.title}\n\n${post.content}\n\n---\n\n**Author:** ${post.author.name}\n**Category:** ${post.category}\n**Tags:** ${post.tags.join(', ')}\n**Published:** ${post.createdAt}`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportAsMarkdown}>
          <FileText className="h-4 w-4 mr-2" />
          Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsPDF}>
          <File className="h-4 w-4 mr-2" />
          PDF (Print)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}