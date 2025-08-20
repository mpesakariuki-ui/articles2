'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsAdmin } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { BarChart3, Users, FileText, MessageSquare, Plus, Settings, Eye } from 'lucide-react';

interface Analytics {
  overview: {
    totalPosts: number;
    totalUsers: number;
    totalViews: number;
    totalComments: number;
  };
  userAnalytics: {
    timeRange: string;
    data: any[];
    newUsers: number;
    activeUsers: number;
  };
  contentAnalytics: {
    timeRange: string;
    data: any[];
    topPosts: Array<{
      id: string;
      title: string;
      views: number;
      comments: number;
    }>;
    engagement: {
      totalViews: number;
      totalComments: number;
    };
  };
}

export default function AdminDashboard() {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    // Don't do anything while checking admin status
    if (adminLoading) return;

    // If not admin, set error and return
    if (!isAdmin) {
      setError('You do not have admin access');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch admin data');
        }
        
        // Validate the data structure
        if (!data.overview || !data.userAnalytics || !data.contentAnalytics) {
          throw new Error('Invalid analytics data structure');
        }

        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load admin data');
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we're admin
    fetchData();
  }, [isAdmin, adminLoading, timeRange]);

  if (loading || adminLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {error || 'You do not have permission to access the admin dashboard.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      <AdminNav />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <select
            className="rounded-md border border-input bg-background px-3 py-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'day' | 'week' | 'month')}
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.overview.totalPosts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Recent posts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.overview.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.overview.totalComments || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total comments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.overview.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      {analytics?.contentAnalytics.topPosts && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Performing Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.contentAnalytics.topPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="truncate flex-1">
                    <Link href={`/posts/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Manage Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/posts">View All Posts</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/posts/new">Create New Post</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/users">
                Manage Users ({analytics?.userAnalytics.activeUsers || 0} active)
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/settings">Configure Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}