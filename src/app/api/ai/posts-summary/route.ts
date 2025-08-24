import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { posts, userId } = await request.json();
    
    if (!posts || posts.length === 0) {
      return NextResponse.json({ summary: 'No posts available to summarize.' });
    }
    
    const postsText = posts.map((post: any) => 
      `Title: ${post.title}\nCategory: ${post.category}\nExcerpt: ${post.excerpt}`
    ).join('\n\n');
    
    const prompt = `Analyze these current posts and provide a brief, engaging summary of the main themes and topics being discussed:

${postsText}

Provide a concise summary (2-3 sentences) highlighting:
1. The main topics and themes covered
2. Any interesting patterns or trends
3. What readers can expect to find

Keep it conversational and engaging.`;

    const summary = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating posts summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}