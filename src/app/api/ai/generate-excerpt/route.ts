import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Generate a compelling 2-3 sentence excerpt for this article content. The excerpt should capture the main idea and entice readers to read more:

${content}

Excerpt:`;

    const result = await model.generateContent(prompt);
    const excerpt = result.response.text().trim();
    
    return NextResponse.json({ excerpt });
  } catch (error) {
    console.error('Error generating excerpt:', error);
    return NextResponse.json({ error: 'Failed to generate excerpt' }, { status: 500 });
  }
}