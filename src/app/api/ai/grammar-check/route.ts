import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `As a professional editor, review this text for grammar, style, and clarity:

"${content}"

Provide feedback on:
1. Grammar and punctuation errors
2. Sentence structure improvements
3. Word choice and clarity
4. Flow and readability
5. Overall writing style

Be specific and constructive in your feedback.`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text().trim();
    
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error checking grammar:', error);
    return NextResponse.json({ error: 'Failed to check grammar' }, { status: 500 });
  }
}