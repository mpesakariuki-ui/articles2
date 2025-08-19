'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { X } from 'lucide-react';

export function SignupReminder() {
  const [showReminder, setShowReminder] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || user) return; // Don't show if loading or user is signed in
    
    const lastReminder = localStorage.getItem('lastSignupReminder');
    const now = Date.now();
    
    // Show reminder if no user and 2 minutes have passed since last reminder
    if (!lastReminder || now - parseInt(lastReminder) > 120000) {
      const timer = setTimeout(() => {
        setShowReminder(true);
        localStorage.setItem('lastSignupReminder', now.toString());
      }, 120000); // 2 minutes

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const handleSignup = () => {
    setShowReminder(false);
    // Redirect to signup
  };

  const handleDismiss = () => {
    setShowReminder(false);
    localStorage.setItem('lastSignupReminder', Date.now().toString());
  };

  return (
    <Dialog open={showReminder} onOpenChange={setShowReminder}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enjoying our articles?</DialogTitle>
          <DialogDescription>
            Create a free account to bookmark articles, leave comments, and get personalized recommendations.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button onClick={handleSignup} className="flex-1">
            Create Account
          </Button>
          <Button variant="outline" onClick={handleDismiss} className="flex-1">
            Maybe Later
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}