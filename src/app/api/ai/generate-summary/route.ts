import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';
import { generateFallbackResponse } from '@/lib/ai-fallback';

const genAI = process.env.GOOGLE_GENAI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { content, title, userId } = await request.json();
    
    const prompt = `Summarize this article in 2-3 sentences: "${title}"

${content.slice(0, 2000)}

Summary:`;

    const summary = await callCustomAI(prompt, userId, async () => {
      if (!genAI) {
        return generateFallbackResponse(prompt, 'generate-summary');
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    const fallbackSummary = generateFallbackResponse('', 'generate-summary');
    return NextResponse.json({ summary: fallbackSummary });
  }
}