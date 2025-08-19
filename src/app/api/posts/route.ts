import { NextRequest, NextResponse } from 'next/server';
import { addPost, getPosts } from '@/lib/firestore';
import { users } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, tags, coverImage, subtopic, bookRecommendations, lectures, references } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newPost = {
      title,
      content: content + (subtopic ? `\n\n## ${subtopic}` : ''),
      category: category || 'General',
      tags: tags || [],
      excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
      author: users[0],
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comments: [],
      recommendedBooks: bookRecommendations ? bookRecommendations.split('\n').filter(Boolean).map((book, i) => ({
        id: `book-${i}`,
        title: book.split(' by ')[0] || book,
        author: book.split(' by ')[1] || 'Unknown',
        imageUrl: 'https://placehold.co/300x400.png'
      })) : [],
      lectures: lectures ? lectures.split('\n').filter(Boolean).map((lecture, i) => ({
        id: `lecture-${i}`,
        title: lecture.split(' - ')[0] || lecture,
        type: 'video' as const,
        embedUrl: lecture.includes('http') ? lecture.split(' - ')[1] || '#' : '#',
        thumbnailUrl: 'https://placehold.co/400x225.png'
      })) : [],
      references: references ? references.split('\n').filter(Boolean) : [],
      coverImage: coverImage || 'https://placehold.co/1200x630.png',
      views: 0,
    };

    const postId = await addPost(newPost);
    return NextResponse.json({ success: true, post: { id: postId, ...newPost } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}