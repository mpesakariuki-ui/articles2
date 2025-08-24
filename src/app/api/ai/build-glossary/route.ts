import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callCustomAI } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content, title, userId } = await request.json();
    
    const prompt = `Extract 5 key terms from this article and create a glossary:

Title: ${title}
Content: ${content.slice(0, 1500)}

For each term, provide:
1. The term
2. Simple definition
3. Context from the article
4. Difficulty level (Basic/Intermediate/Advanced)

Format as JSON array with objects containing: term, definition, context, difficulty`;

    const responseText = await callCustomAI(prompt, userId, async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });
    
    // Try to extract JSON from the response
    let terms = [];
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        terms = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback terms
        terms = [
          {
            term: "Key Concept",
            definition: "Important idea from the article",
            context: "Used throughout the text",
            difficulty: "Intermediate"
          }
        ];
      }
    } catch (parseError) {
      terms = [
        {
          term: "Main Topic",
          definition: "Central theme of the article",
          context: "Discussed in detail",
          difficulty: "Basic"
        }
      ];
    }
    
    return NextResponse.json({ terms });
  } catch (error) {
    console.error('Error building glossary:', error);
    return NextResponse.json({ error: 'Failed to build glossary' }, { status: 500 });
  }
}