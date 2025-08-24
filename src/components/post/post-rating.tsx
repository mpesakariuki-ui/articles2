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
      title: "⭐ Rating submitted!",
      description: `You gave this article ${value} star${value !== 1 ? 's' : ''}. Thank you for your feedback!`,
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-amber-200 dark:border-amber-700">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/20 rounded-full transition-all duration-200 transform hover:scale-110"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRating(star)}
          >
            <Star
              className={`h-6 w-6 transition-all duration-200 ${
                star <= (hover || userRating)
                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                  : 'text-gray-300 hover:text-amber-300'
              }`}
            />
          </Button>
        ))}
      </div>
      {userRating > 0 ? (
        <div className="text-center">
          <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">
            {userRating}/5 Stars
          </div>
          <div className="text-xs text-muted-foreground">
            Thank you for rating!
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground text-center">
          Click a star to rate
        </div>
      )}
    </div>
  );
}