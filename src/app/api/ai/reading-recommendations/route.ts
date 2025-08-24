import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPosts } from '@/lib/firestore';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { currentPost, userId } = await request.json();
    
    const allPosts = await getPosts();
    const otherPosts = allPosts.filter(post => post.title !== currentPost.title);
    
    const prompt = `Based on this article:
Title: ${currentPost.title}
Category: ${currentPost.category}
Tags: ${currentPost.tags.join(', ')}
Content: ${currentPost.content}

From these available articles, recommend the 3 most relevant ones:
${otherPosts.map(post => `- ${post.title} (${post.category})`).join('\n')}

Return only the exact titles of the 3 recommended articles, one per line.`;

    const responseText = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    const recommendedTitles = responseText.split('\n').slice(0, 3);
    
    const recommendations = otherPosts.filter(post => 
      recommendedTitles.some(title => post.title.includes(title.replace('- ', '').trim()))
    ).slice(0, 3);
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}