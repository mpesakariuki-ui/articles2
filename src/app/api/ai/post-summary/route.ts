import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { postId, content, title } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Create a concise 2-3 sentence summary of this article:

Title: ${title}
Content: ${content.slice(0, 2000)}

Summary should capture the main points and key insights in an engaging way.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating post summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}