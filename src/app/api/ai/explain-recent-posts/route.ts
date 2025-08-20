import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { posts } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const postsList = posts.map((p: any) => `- ${p.title} (${p.category}): ${p.excerpt}`).join('\n');
    
    const prompt = `Analyze these recent posts and provide an overview of the current content themes and topics:

${postsList}

Explain:
1. What themes and topics are currently being covered
2. The variety of content available
3. What readers can expect from these recent articles

Keep it engaging and informative in 3-4 sentences.`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text().trim();
    
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error explaining recent posts:', error);
    return NextResponse.json({ error: 'Failed to explain recent posts' }, { status: 500 });
  }
}