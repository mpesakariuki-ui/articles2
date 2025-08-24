import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';
import { generateFallbackResponse } from '@/lib/ai-fallback';

const genAI = process.env.GOOGLE_GENAI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { content, title, question, userId } = await request.json();
    
    const prompt = `Based on this article titled "${title}":

${content.slice(0, 2000)}

Answer this question: ${question}

Provide a clear, concise answer based on the article content:`;

    const answer = await callCustomAI(prompt, userId, async () => {
      if (!genAI) {
        return "I'd be happy to help answer your question, but I need access to AI services to provide a detailed response. Please configure your AI settings or try again later.";
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json({ answer: "AI service temporarily unavailable. Please try again later." });
  }
}