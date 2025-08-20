'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminNav } from '@/components/admin/admin-nav';
import { BarChart3, TrendingUp, Eye, MessageSquare, Users, Calendar } from 'lucide-react';
import type { Post } from '@/lib/types';

export default function AdminAnalytics() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalComments: 0,
    avgViewsPerPost: 0,
    topCategory: '',
    mostViewedPost: null as Post | null
  });

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        const postsData = Array.isArray(data) ? data : [];
        setPosts(postsData);
        
        // Calculate analytics
        const totalViews = postsData.reduce((sum, post) => sum + (post.views || 0), 0);
        const totalComments = postsData.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
        const avgViews = postsData.length > 0 ? Math.round(totalViews / postsData.length) : 0;
        
        // Find top category
        const categoryCount = postsData.reduce((acc, post) => {
          acc[post.category] = (acc[post.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || '';
        
        // Find most viewed post
        const mostViewed = postsData.reduce((max, post) => 
          (post.views || 0) > (max?.views || 0) ? post : max, postsData[0]);
        
        setAnalytics({
          totalViews,
          totalComments,
          avgViewsPerPost: avgViews,
          topCategory,
          mostViewedPost: mostViewed
        });
      })
      .catch(console.error);
  }, []);

  const sortedPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));

  return (
    <div className="container max-w-7xl py-8">
      <AdminNav />
      <h1 className="text-3xl font-bold mb-8">Site Analytics</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalComments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views/Post</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgViewsPerPost}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{analytics.topCategory}</div>
          </CardContent>
        </Card>
      </div>

      {/* Most Viewed Post */}
      {analytics.mostViewedPost && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Most Viewed Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">{analytics.mostViewedPost.title}</h3>
                <p className="text-muted-foreground mb-2">{analytics.mostViewedPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="secondary">{analytics.mostViewedPost.category}</Badge>
                  <span>{analytics.mostViewedPost.createdAt}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{analytics.mostViewedPost.views || 0}</div>
                <div className="text-sm text-muted-foreground">views</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Post Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedPosts.map((post, index) => (
              <div key={post.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                  <div>
                    <h4 className="font-semibold">{post.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold">{post.views || 0}</div>
                    <div className="text-muted-foreground">views</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{post.comments?.length || 0}</div>
                    <div className="text-muted-foreground">comments</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}