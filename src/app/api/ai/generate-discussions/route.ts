import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content, title, userId } = await request.json();
    
    const prompt = `Based on the article "${title}", generate 3 thought-provoking discussion questions that would engage readers. Format as a simple list.`;

    const questionsText = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    const questions = questionsText.split('\n').filter(line => line.trim()).slice(0, 3);
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating discussions:', error);
    return NextResponse.json({ error: 'Failed to generate discussions' }, { status: 500 });
  }
}