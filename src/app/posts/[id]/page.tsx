import { getPostById } from '@/lib/store';
import { PostView } from '@/components/post/post-view';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function PostPage({ params }: { params: { id: string } }) {
  const post = getPostById(params.id);

  if (!post) {
    notFound();
  }

  return <PostView post={post} />;
}
