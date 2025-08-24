import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { word, userId } = await request.json();
    
    const prompt = `Provide a brief, clear definition of the word "${word}" in 1-2 sentences. Keep it simple and easy to understand.`;

    const definition = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ definition });
  } catch (error) {
    console.error('Error defining word:', error);
    return NextResponse.json({ error: 'Failed to define word' }, { status: 500 });
  }
}