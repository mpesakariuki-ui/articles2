import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Extract 5 key concepts or terms from this article that readers might want explained: "${content.slice(0, 1000)}". Return only the terms, separated by commas.`;

    const result = await model.generateContent(prompt);
    const conceptsText = result.response.text().trim();
    const concepts = conceptsText.split(',').map(c => c.trim()).slice(0, 5);
    
    return NextResponse.json({ concepts });
  } catch (error) {
    console.error('Error extracting concepts:', error);
    return NextResponse.json({ error: 'Failed to extract concepts' }, { status: 500 });
  }
}