import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post/post-card';
import { posts } from '@/lib/data';
import type { Post } from '@/lib/types';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-4">
          The Pillar of Knowledge
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          A space for curated articles, research, and creative works. Explore, learn, and engage with our community.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/posts/new">Create a Post</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="#featured-posts">Explore Posts</Link>
          </Button>
        </div>
      </section>

      <section id="featured-posts" className="py-16">
        <h2 className="font-headline text-4xl font-bold text-center mb-12">Featured Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
