import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Identify 3 key passages from this article that are worth bookmarking:

Title: ${title}
Content: ${content.slice(0, 2000)}

For each passage, provide:
1. The exact text (keep it under 100 words)
2. Importance level (High/Medium/Low)
3. Brief reason why it's important

Format as JSON array with objects containing: text, importance, reason`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Try to extract JSON from the response
    let passages = [];
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        passages = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if no JSON found
        passages = [
          {
            text: "Key insight from the article",
            importance: "High",
            reason: "Contains important information"
          }
        ];
      }
    } catch (parseError) {
      passages = [
        {
          text: "Important passage identified",
          importance: "Medium", 
          reason: "Significant content for understanding"
        }
      ];
    }
    
    return NextResponse.json({ passages });
  } catch (error) {
    console.error('Error identifying passages:', error);
    return NextResponse.json({ error: 'Failed to identify passages' }, { status: 500 });
  }
}