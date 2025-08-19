'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="mx-auto h-24 w-24 text-destructive mb-8" />
      <h1 className="font-headline text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}