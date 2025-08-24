import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { title, category, content, userId } = await request.json();
    
    const prompt = `As a professional writing assistant, help improve this article:

Title: ${title}
Category: ${category}
Current Content: ${content || 'No content yet'}

Provide specific suggestions for:
1. Content structure and organization
2. Key points to cover for this topic
3. Engaging introduction ideas
4. Supporting arguments or examples
5. Strong conclusion approaches

Keep suggestions practical and actionable.`;

    const suggestions = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating writing suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}