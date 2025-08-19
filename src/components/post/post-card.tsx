import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const authorInitials = post.author.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
      <CardHeader>
        <div className="relative aspect-video w-full mb-4">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="rounded-t-lg object-cover"
            data-ai-hint="article illustration"
          />
        </div>
        <div className="space-y-1">
          {post.category && (
            <Badge variant="outline" className="text-sm mb-2">{post.category}</Badge>
          )}
          <CardTitle className="font-headline text-2xl">
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription>{post.excerpt}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="author portrait" />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
        </div>
        <Link href={`/posts/${post.id}`} className="flex items-center text-sm text-accent-foreground hover:text-accent transition-colors">
          Read More <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
