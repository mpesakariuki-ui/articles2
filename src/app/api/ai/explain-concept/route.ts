import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { concept, title, userId } = await request.json();
    
    const prompt = `Explain the concept "${concept}" in simple terms, in the context of this article: "${title}". Keep it brief and easy to understand.`;

    const explanation = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error explaining concept:', error);
    return NextResponse.json({ error: 'Failed to explain concept' }, { status: 500 });
  }
}