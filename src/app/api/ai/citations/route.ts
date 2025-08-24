import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Based on this article topic and content, suggest 5 relevant academic sources with proper APA citations:

Title: ${title}
Content: ${content}

Provide realistic APA format citations for:
1. Academic journal articles
2. Books by experts
3. Government or institutional reports
4. Recent research studies
5. Authoritative websites

Format each citation in proper APA style (Author, A. A. (Year). Title. Journal/Publisher.).
Make citations relevant to the topic and realistic.`;

    const result = await model.generateContent(prompt);
    const citationText = result.response.text().trim();
    
    // Split citations by line breaks and filter out empty lines
    const citations = citationText.split('\n').filter((line: string) => line.trim().length > 0);
    
    return NextResponse.json({ citations });
  } catch (error) {
    console.error('Error generating citations:', error);
    return NextResponse.json({ error: 'Failed to generate citations' }, { status: 500 });
  }
}