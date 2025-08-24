import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';
import { generateFallbackResponse } from '@/lib/ai-fallback';

const genAI = process.env.GOOGLE_GENAI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { word, userId } = await request.json();
    
    const prompt = `Provide a brief, clear definition of the word "${word}" in 1-2 sentences. Keep it simple and easy to understand.`;

    const definition = await callCustomAI(prompt, userId, async () => {
      if (!genAI) {
        return generateFallbackResponse(prompt, 'define-word');
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ definition });
  } catch (error) {
    console.error('Error defining word:', error);
    const { word } = await request.json();
    const fallbackDefinition = generateFallbackResponse(`word "${word}"`, 'define-word');
    return NextResponse.json({ definition: fallbackDefinition });
  }
}