import type { Post } from './types';
import { users, comments, books, lectures } from './data';

// Global store that persists across requests
const globalStore = globalThis as unknown as {
  postsStore: Post[];
};

if (!globalStore.postsStore) {
  globalStore.postsStore = [
    {
      id: '1',
      title: 'The Symbiosis of Art and Science in the Renaissance',
      content: 'The Renaissance was a period of profound cultural and intellectual transformation, characterized by a remarkable fusion of art and science. This era, spanning roughly from the 14th to the 17th century, saw artists like Leonardo da Vinci and Michelangelo not merely as creators of aesthetic beauty, but as rigorous investigators of the natural world.',
      author: users[0],
      createdAt: 'October 26, 2023',
      category: 'Art History',
      tags: ['Renaissance', 'Art', 'Science', 'Leonardo da Vinci'],
      excerpt: 'Explore the profound fusion of art and science during the Renaissance.',
      coverImage: 'https://placehold.co/1200x630.png',
      comments: comments,
      recommendedBooks: books,
      lectures: lectures,
      views: 0,
    },
    {
      id: '2',
      title: 'A Short Poem on Time',
      content: `A fleeting guest, a river's flow,\nWhere moments come and moments go.\nA silent thief, a healer's balm,\nIt brings the storm, and then the calm.`,
      author: users[1],
      createdAt: 'November 5, 2023',
      category: 'Poetry',
      tags: ['Time', 'Life', 'Reflection'],
      excerpt: 'A brief, reflective poem on the ceaseless and multifaceted nature of time.',
      coverImage: 'https://placehold.co/1200x630.png',
      comments: [],
      recommendedBooks: [],
      lectures: [],
      views: 0,
    },
  ];
}

export const posts = globalStore.postsStore;

export function addPost(postData: Omit<Post, 'id' | 'author' | 'createdAt' | 'comments' | 'recommendedBooks' | 'lectures' | 'coverImage'>): Post {
  const newPost: Post = {
    id: String(Date.now()),
    author: users[0],
    createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    comments: [],
    recommendedBooks: [],
    lectures: [],
    coverImage: 'https://placehold.co/1200x630.png',
    views: 0,
    ...postData,
  };
  globalStore.postsStore.unshift(newPost);
  return newPost;
}

export function getPostById(id: string): Post | undefined {
  return globalStore.postsStore.find(post => post.id === id);
}

export function incrementViews(id: string): void {
  const post = globalStore.postsStore.find(post => post.id === id);
  if (post) {
    post.views = (post.views || 0) + 1;
  }
}