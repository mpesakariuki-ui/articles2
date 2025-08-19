'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PostRatingProps {
  postId: string;
}

export function PostRating({ postId }: PostRatingProps) {
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { toast } = useToast();

  const handleRating = (value: number) => {
    setUserRating(value);
    setRating(value);
    toast({
      title: "Rating submitted",
      description: `You rated this post ${value} star${value !== 1 ? 's' : ''}.`,
    });
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium">Rate this post:</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className="p-1"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRating(star)}
          >
            <Star
              className={`h-4 w-4 ${
                star <= (hover || userRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </Button>
        ))}
      </div>
      {userRating > 0 && (
        <span className="text-sm text-muted-foreground">
          ({userRating}/5)
        </span>
      )}
    </div>
  );
}