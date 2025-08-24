import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    const aboutContent = `Pillar Page is an AI-powered knowledge platform that revolutionizes reading and learning. 

Key Features:
- Smart Summaries: AI-generated article summaries
- Interactive Q&A: Ask questions about articles
- Text Highlighting: Get explanations for highlighted text
- Reading Recommendations: Personalized content suggestions
- Smart Bookmarks: AI identifies important passages
- Reference Finder: Find online sources for references
- Community Features: Interactive comments and AI chat assistant

Technology: Built with Next.js 14, React, TypeScript, Tailwind CSS, Firebase, and Google AI.

Mission: Make knowledge more accessible, engaging, and personalized through AI technology while maintaining privacy and security.`;

    const prompt = `Summarize this about page content in 2-3 sentences, highlighting the main purpose and key AI features:

${aboutContent}`;

    const summary = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing about page:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}