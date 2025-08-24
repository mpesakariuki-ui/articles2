import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { text, userId } = await request.json();
    
    const prompt = `Explain this text passage in simple terms and provide relevant references:

"${text}"

Provide:
1. A clear explanation of what this text means
2. Key concepts or terms explained
3. 2-3 relevant reference URLs (academic sources, Wikipedia, etc.)

Format the response as:
Explanation: [your explanation]
References: [list of URLs]`;

    const responseText = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    // Parse explanation and references
    const explanationMatch = responseText.match(/Explanation:\s*([\s\S]*?)(?=References:|$)/);
    const referencesMatch = responseText.match(/References:\s*([\s\S]*)/);
    
    const explanation = explanationMatch ? explanationMatch[1].trim() : responseText;
    const references = referencesMatch 
      ? referencesMatch[1].split('\n')
          .filter((line: string) => line.includes('http'))
          .map((line: string) => line.trim())
          .slice(0, 3)
      : [];
    
    return NextResponse.json({ explanation, references });
  } catch (error) {
    console.error('Error explaining text:', error);
    return NextResponse.json({ error: 'Failed to explain text' }, { status: 500 });
  }
}