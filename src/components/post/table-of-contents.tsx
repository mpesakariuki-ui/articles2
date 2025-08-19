'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([]);

  useEffect(() => {
    const headings = content.match(/^#{1,3}\s+(.+)$/gm) || [];
    const tocItems = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const text = heading.replace(/^#+\s+/, '');
      return {
        id: `heading-${index}`,
        text,
        level,
      };
    });
    setToc(tocItems);
  }, [content]);

  if (toc.length === 0) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 16}px` }}>
              <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-primary">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}