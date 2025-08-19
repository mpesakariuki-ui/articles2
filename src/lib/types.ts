export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

export interface Lecture {
  id: string;
  title: string;
  type: 'video' | 'slides';
  embedUrl: string;
  thumbnailUrl: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  category: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  comments: Comment[];
  recommendedBooks: Book[];
  lectures: Lecture[];
  references?: string[];
  views?: number;
}
