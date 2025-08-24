'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  BookOpen, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Lock, 
  Unlock,
  CreditCard,
  Bookmark,
  Sparkles,
  Users
} from 'lucide-react';
import type { Post } from '@/lib/types';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [earnings, setEarnings] = useState({ total: 0, available: 0, pending: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawing, setWithdrawing] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  const handleWithdrawal = async () => {
    if (!user?.uid || !mpesaNumber || withdrawAmount <= 0) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          amount: withdrawAmount,
          mpesaNumber,
          currency: 'KES'
        })
      });

      if (!response.ok) {
        throw new Error('Withdrawal failed');
      }

      // Update local state
      setEarnings(prev => ({
        ...prev,
        available: prev.available - withdrawAmount
      }));
      setTransactions(prev => [{
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: withdrawAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        mpesaNumber
      }, ...prev]);

      setWithdrawing(false);
      setMpesaNumber('');
      setWithdrawAmount(0);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    
    fetchUserData();
  }, [user, authLoading]);

  const fetchUserData = async () => {
    if (!user?.email) return;

    try {
      const [postsRes, bookmarksRes, recsRes, earningsRes, transactionsRes] = await Promise.all([
        fetch(`/api/posts/user/${user.email}`),
        fetch(`/api/user/bookmarks?userId=${user.uid}`),
        fetch(`/api/user/recommendations?userId=${user.uid}`),
        fetch(`/api/user/earnings?userId=${user.uid}`),
        fetch(`/api/user/transactions?userId=${user.uid}`)
      ]);

      if (!postsRes.ok) throw new Error('Failed to fetch posts');
      if (!bookmarksRes.ok) throw new Error('Failed to fetch bookmarks');
      if (!recsRes.ok) throw new Error('Failed to fetch recommendations');
      if (!earningsRes.ok) throw new Error('Failed to fetch earnings');
      if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');

      const [posts, bookmarksData, recsData, earningsData, transactionsData] = await Promise.all([
        postsRes.json(),
        bookmarksRes.json(),
        recsRes.json(),
        earningsRes.json(),
        transactionsRes.json()
      ]);

      setUserPosts(posts);
      setBookmarks(bookmarksData.map((b: any) => ({
        id: b.id,
        title: b.title || b.content?.substring(0, 50),
        url: `/posts/${b.id}`
      })));
      setRecommendations(recsData.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        score: r.score
      })));
      setEarnings(earningsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePostLock = async (postId: string, isLocked: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: !isLocked })
      });

      if (!response.ok) {
        throw new Error('Failed to update post lock status');
      }

      // Update local state
      setUserPosts(posts => 
        posts.map(post => 
          post.id === postId 
            ? { ...post, locked: !isLocked }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling post lock:', error);
    }
  };

  const enablePaywall = async (postId: string, price: number) => {
    try {
      await fetch(`/api/posts/${postId}/paywall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, paymentMethod: 'mpesa' })
      });
      
      // Post updated
    } catch (error) {
      console.error('Error enabling paywall:', error);
    }
  };

  const withdrawEarnings = async () => {
    if (!mpesaNumber.trim()) {
      alert('Please enter your M-Pesa number');
      return;
    }
    
    if (earnings.available < 100) {
      alert('Minimum withdrawal amount is KES 100');
      return;
    }

    setWithdrawing(true);
    try {
      const response = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          amount: earnings.available,
          mpesaNumber: mpesaNumber
        })
      });

      if (response.ok) {
        alert('Withdrawal request submitted! You will receive payment within 24 hours.');
        setEarnings(prev => ({ ...prev, available: 0, pending: prev.available }));
        fetchUserData(); // Refresh data
      } else {
        throw new Error('Withdrawal failed');
      }
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to view your analytics and reading behavior.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your reading behavior and post performance</p>
      </div>

      {/* Reading Behavior Section */}
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold mb-6 flex items-center">
          <Sparkles className="mr-3 h-6 w-6 text-primary" />
          Reading Behavior & AI Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Saved Bookmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bookmarks.length > 0 ? (
                  bookmarks.map((bookmark, index) => (
                    <Badge key={index} variant="secondary" className="block w-fit">
                      {bookmark}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No bookmarks yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <Badge key={index} variant="outline" className="block w-fit">
                      {rec}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recommendations yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Reading Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Articles Read</span>
                  <span className="font-semibold">{bookmarks.length + recommendations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">AI Queries</span>
                  <span className="font-semibold">{bookmarks.length * 6 + recommendations.length * 4}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bookmarks</span>
                  <span className="font-semibold">{bookmarks.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Post Analytics Section */}
      <section>
        <h2 className="font-headline text-2xl font-bold mb-6 flex items-center">
          <BarChart3 className="mr-3 h-6 w-6 text-primary" />
          Your Posts Analytics
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Published {post.createdAt}
                      </p>
                    </div>
                    <Badge variant={'default'}>
                      Published
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{post.views || 0}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{post.comments?.length || 0}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{Math.floor((post.views || 0) * 0.7)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Readers</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{Math.floor((post.views || 0) * 0.15)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`lock-${post.id}`}
                        checked={false}
                        onCheckedChange={() => togglePostLock(post.id, false)}
                      />
                      <Label htmlFor={`lock-${post.id}`} className="flex items-center gap-1">
                        <Unlock className="h-4 w-4" />
                        Public
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Price (KES)"
                        className="w-24 h-8"
                        min="1"
                        id={`price-${post.id}`}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const priceInput = document.getElementById(`price-${post.id}`) as HTMLInputElement;
                          const price = parseInt(priceInput.value);
                          if (price > 0) {
                            enablePaywall(post.id, price);
                          }
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Enable M-Pesa Pay
                      </Button>
                    </div>


                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first post to see analytics and engagement data.
              </p>
              <Button onClick={() => router.push('/create-post')}>
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <Separator className="my-8" />

      {/* Payment Management Section */}
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold mb-6 flex items-center">
          <CreditCard className="mr-3 h-6 w-6 text-primary" />
          Payment Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Earned</span>
                  <span className="font-bold text-lg">KES {earnings.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="font-semibold text-green-600">KES {earnings.available}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-semibold text-yellow-600">KES {earnings.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdraw to M-Pesa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mpesa">M-Pesa Number</Label>
                  <Input
                    id="mpesa"
                    type="tel"
                    placeholder="254712345678"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={withdrawEarnings} 
                  disabled={withdrawing || earnings.available < 100}
                  className="w-full"
                >
                  {withdrawing ? 'Processing...' : `Withdraw KES ${earnings.available}`}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Minimum withdrawal: KES 100. Processing time: 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'Payment Received' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {transaction.type === 'Withdrawal' ? '-' : '+'}KES {transaction.amount}
                      </p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet. Start earning by enabling paywalls on your posts!
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}