import { posts } from '@/lib/data';
import { PostView } from '@/components/post/post-view';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default function PostPage({ params }: { params: { id: string } }) {
  const post = posts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  return <PostView post={post} />;
}
