'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Clock, User } from 'lucide-react';

interface Version {
  id: string;
  version: number;
  changes: string;
  createdAt: string;
  author: string;
}

interface VersionControlProps {
  paperId: string;
}

export function VersionControl({ paperId }: VersionControlProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [paperId]);

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/research/${paperId}/versions`);
      if (!response.ok) {
        setVersions([]);
        return;
      }
      const data = await response.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
      setVersions([]);
    }
  };

  const createVersion = async (changes: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/research/${paperId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes })
      });
      
      if (response.ok) {
        fetchVersions();
      }
    } catch (error) {
      console.error('Error creating version:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {versions.map((version) => (
            <div key={version.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Badge variant="outline">v{version.version}</Badge>
                <div>
                  <p className="text-sm font-medium">{version.changes}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{version.author}</span>
                    <Clock className="h-3 w-3" />
                    <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}