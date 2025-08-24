import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, posts, userId } = await request.json();
    
    const siteInfo = `Pillar Page is a modern article publishing platform featuring:
- AI-powered reading assistance
- Community discussions
- Rich content with references and recommendations
- Categories: Technology, Science, Arts, Philosophy, etc.
- Interactive features like summaries, Q&A, and glossaries`;

    const postsList = posts.map((p: any) => `- ${p.title} (${p.category}) - /posts/${p.id}`).join('\n');
    
    const prompt = `You are the AI assistant for Pillar Page website. 

Site Information:
${siteInfo}

Available Posts:
${postsList}

User Question: ${message}

Respond helpfully about:
1. Site theme and features if asked
2. Recommend relevant posts based on user interest
3. Provide post URLs when discussing specific articles

If recommending posts, include their URLs in format: /posts/[id]

Keep responses conversational and helpful.`;

    const responseText = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    // Extract URLs from response
    const urlMatches = responseText.match(/\/posts\/[a-zA-Z0-9]+/g) || [];
    const urls = urlMatches.map(url => `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${url}`);
    
    return NextResponse.json({ 
      response: responseText,
      urls 
    });
  } catch (error) {
    console.error('Error in site chat:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}