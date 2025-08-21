'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user.emailVerified) {
          await auth.signOut();
          toast({ 
            title: "Email not verified", 
            description: "Please verify your email before signing in. Check your inbox for the verification link.", 
            variant: "destructive" 
          });
          return;
        }
        
        toast({ title: "Welcome back!", description: "You've been signed in successfully." });
        onClose();
      } else {
        // Signup validation
        if (password !== confirmPassword) {
          toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
          return;
        }
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
          toast({ title: "Error", description: "Password must contain at least one letter and one number.", variant: "destructive" });
          return;
        }
        if (!acceptTerms) {
          toast({ title: "Error", description: "Please accept the privacy terms.", variant: "destructive" });
          return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || '',
          photoURL: userCredential.user.photoURL || '',
          privacyTermsAccepted: true,
          privacyTermsAcceptedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          emailVerified: false
        });
        
        await sendEmailVerification(userCredential.user);
        setStep('verification');
        toast({ title: "Verification sent!", description: "Check your email for verification code." });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({ 
      title: "Check your email", 
      description: "Click the verification link in your email to complete registration." 
    });
    onClose();
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Store/update user data in Firestore for Google auth
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        privacyTermsAccepted: true,
        privacyTermsAcceptedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        emailVerified: result.user.emailVerified,
        provider: 'google'
      }, { merge: true });
      
      toast({ title: "Welcome!", description: "You've been signed in with Google." });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Sign In' : 'Create Account'}</DialogTitle>
          <DialogDescription>
            {mode === 'login' ? 'Enter your credentials to access your account.' : 'Create a new account to get started.'}
          </DialogDescription>
        </DialogHeader>
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground">
                  Must contain at least one letter and one number
                </p>
              )}
            </div>
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      privacy terms
                    </Link>
                  </Label>
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <h3 className="font-semibold">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a verification link to <strong>{email}</strong>. 
                Click the link in your email to complete your registration.
              </p>
            </div>
            <Button onClick={() => onClose()} className="w-full">
              Got it
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => setStep('form')}>
              Back
            </Button>
          </div>
        )}
        {step === 'form' && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuth} disabled={isLoading}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}