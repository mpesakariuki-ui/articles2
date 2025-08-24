import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateFallbackResponse } from '@/lib/ai-fallback';

const genAI = process.env.GOOGLE_GENAI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();
    
    if (!genAI) {
      const fallbackTags = ['general', 'article', 'content', 'information', 'research'];
      return NextResponse.json({ tags: fallbackTags });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Based on this article title and content, suggest 5-7 relevant tags that would help categorize and make this content discoverable:

Title: ${title}
Content: ${content}

Return only the tags as a comma-separated list:`;

    const result = await model.generateContent(prompt);
    const tagsText = result.response.text().trim();
    const tags = tagsText.split(',').map((tag: string) => tag.trim());
    
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error suggesting tags:', error);
    const fallbackTags = ['general', 'article', 'content', 'information', 'research'];
    return NextResponse.json({ tags: fallbackTags });
  }
}