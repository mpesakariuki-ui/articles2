'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface PeerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperId: string;
}

export function PeerReviewModal({ isOpen, onClose, paperId }: PeerReviewModalProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, paperId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/research/${paperId}/reviews`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({ title: 'Please sign in to submit a review', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/research/${paperId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: parseInt(newReview.rating),
          comment: newReview.comment,
          reviewerId: user.uid,
          reviewerName: user.displayName || user.email
        })
      });

      if (response.ok) {
        toast({ title: 'Review submitted successfully!' });
        setNewReview({ rating: '', comment: '' });
        fetchReviews();
      }
    } catch (error) {
      toast({ title: 'Error submitting review', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Peer Reviews
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {user && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Submit Your Review</h3>
              <div>
                <Label>Rating</Label>
                <Select value={newReview.rating} onValueChange={(value) => setNewReview({...newReview, rating: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="2">2 - Poor</SelectItem>
                    <SelectItem value="1">1 - Very Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Review Comments</Label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Provide constructive feedback..."
                  rows={4}
                />
              </div>
              <Button onClick={submitReview} disabled={loading || !newReview.rating}>
                Submit Review
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews ({reviews.length})
            </h3>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.reviewerName}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}