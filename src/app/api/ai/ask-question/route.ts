import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content, title, question } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Based on this article titled "${title}":

${content.slice(0, 2000)}

Answer this question: ${question}

Provide a clear, concise answer based on the article content:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text().trim();
    
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json({ error: 'Failed to answer question' }, { status: 500 });
  }
}