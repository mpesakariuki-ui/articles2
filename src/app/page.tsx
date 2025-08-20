'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post/post-card';
import { AdvancedSearch } from '@/components/search/advanced-search';
import { RecentPosts } from '@/components/sidebar/recent-posts';
import { SiteChatbot } from '@/components/chat/site-chatbot';
import type { Post } from '@/lib/types';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [scrolledToPosts, setScrolledToPosts] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('welcomeDismissed');
    if (dismissed) {
      setWelcomeDismissed(true);
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const postsSection = document.getElementById('featured-posts');
      if (postsSection) {
        const rect = postsSection.getBoundingClientRect();
        setScrolledToPosts(rect.top <= 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    setWelcomeDismissed(true);
    localStorage.setItem('welcomeDismissed', 'true');
  };

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        const posts = Array.isArray(data.posts) ? data.posts : [];
        console.log('Fetched posts:', posts); // Debug log
        setAllPosts(posts);
        setFilteredPosts(posts);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setAllPosts([]);
        setFilteredPosts([]);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <section className="text-center py-8 md:py-16">
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4">
          The Pillar of Knowledge
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 px-2">
          A space for curated articles, research, and creative works. Explore, learn, and engage with our community.
        </p>
        <div className="flex justify-center">
          <Button asChild className="animate-pulse">
            <Link href="#featured-posts">Explore Posts</Link>
          </Button>
        </div>
        
        {showWelcome && !welcomeDismissed && (
          <div className={`mt-6 md:mt-8 mx-auto max-w-2xl px-4 transition-opacity duration-300 ${scrolledToPosts ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 md:p-4 relative animate-in slide-in-from-top duration-500">
              <button 
                onClick={dismissWelcome}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground touch-manipulation"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-100">Welcome to Pillar Page!</h3>
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-200 mt-1">This is an AI-powered knowledge platform. Discover intelligent features like summaries, Q&A, and personalized recommendations throughout your reading journey.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section id="featured-posts" className="py-8 md:py-16">
        <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">Featured Posts</h2>
        <div className="mb-6 md:mb-8">
          <AdvancedSearch posts={allPosts} onResults={setFilteredPosts} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {Array.isArray(filteredPosts) && filteredPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {filteredPosts.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <p className="text-muted-foreground">No posts found matching your search.</p>
              </div>
            )}
          </div>
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <RecentPosts />
          </div>
        </div>
      </section>
      
      <SiteChatbot posts={filteredPosts} />
    </div>
  );
}
