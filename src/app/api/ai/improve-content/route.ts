import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Improve this text by making it clearer, more engaging, and better written while maintaining the original meaning and tone:

${text}

Improved version:`;

    const result = await model.generateContent(prompt);
    const improvedText = result.response.text().trim();
    
    return NextResponse.json({ improvedText });
  } catch (error) {
    console.error('Error improving content:', error);
    return NextResponse.json({ error: 'Failed to improve content' }, { status: 500 });
  }
}