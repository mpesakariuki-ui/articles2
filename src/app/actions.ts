'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { posts } from '@/lib/store';
import { users } from '@/lib/data';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string || 'General';
  const tags = (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean);

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const newPost = {
    id: String(Date.now()),
    title,
    content,
    category,
    tags,
    excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
    author: users[0],
    createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    comments: [],
    recommendedBooks: [],
    lectures: [],
    coverImage: 'https://placehold.co/1200x630.png',
  };

  posts.unshift(newPost);
  revalidatePath('/');
  redirect(`/posts/${newPost.id}`);
}