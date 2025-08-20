'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Sparkles, Search } from 'lucide-react';

interface ReferenceUrl {
  reference: string;
  urls: string[];
  status: 'found' | 'not_found' | 'partial';
}

interface ReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  references: string[];
}

export function ReferencesModal({ isOpen, onClose, references }: ReferencesModalProps) {
  const [referenceUrls, setReferenceUrls] = useState<ReferenceUrl[]>([]);
  const [loading, setLoading] = useState(false);

  const findUrls = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/find-reference-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ references })
      });
      
      const data = await response.json();
      setReferenceUrls(data.referenceUrls || []);
    } catch (error) {
      console.error('Error finding URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Reference URL Finder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button onClick={findUrls} disabled={loading}>
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Find URLs for References'}
            </Button>
          </div>
          
          {loading && (
            <div className="space-y-4">
              {references.map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {referenceUrls.length > 0 && (
            <div className="space-y-4">
              {referenceUrls.map((refUrl, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-sm">{refUrl.reference}</h4>
                      <Badge variant={
                        refUrl.status === 'found' ? 'default' :
                        refUrl.status === 'partial' ? 'secondary' : 'destructive'
                      }>
                        {refUrl.status === 'found' ? 'Found' :
                         refUrl.status === 'partial' ? 'Partial' : 'Not Found'}
                      </Badge>
                    </div>
                    
                    {refUrl.urls.length > 0 ? (
                      <div className="space-y-2">
                        {refUrl.urls.map((url, urlIndex) => (
                          <div key={urlIndex} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm break-all"
                            >
                              {url}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No URLs found for this reference</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && referenceUrls.length === 0 && references.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Click "Find URLs for References" to search for online sources
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}