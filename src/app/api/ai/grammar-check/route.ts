import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content, userId } = await request.json();
    
    const prompt = `As a professional editor, review this text for grammar, style, and clarity:

"${content}"

Provide feedback on:
1. Grammar and punctuation errors
2. Sentence structure improvements
3. Word choice and clarity
4. Flow and readability
5. Overall writing style

Be specific and constructive in your feedback.`;

    const feedback = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error checking grammar:', error);
    return NextResponse.json({ error: 'Failed to check grammar' }, { status: 500 });
  }
}