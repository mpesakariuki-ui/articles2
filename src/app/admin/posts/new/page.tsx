import { PostEditor } from '@/components/post/post-editor';
import { AdminNav } from '@/components/admin/admin-nav';

export default function NewPostPage() {
  return (
    <div className="container max-w-4xl py-8">
      <AdminNav />
      <PostEditor />
    </div>
  );
}
