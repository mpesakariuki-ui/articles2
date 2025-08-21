import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { references } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const results = await Promise.all(
      references.map(async (ref: string) => {
        try {
          const prompt = `Analyze this academic reference and determine if it's properly formatted and potentially valid:
"${ref}"

Check for:
1. Proper citation format
2. Realistic publication details
3. Valid URL if present

Return JSON: {"isValid": boolean, "url": "string or null", "error": "string or null"}`;

          const result = await model.generateContent(prompt);
          const response = result.response.text();
          
          try {
            const parsed = JSON.parse(response);
            return { reference: ref, ...parsed };
          } catch {
            // Fallback validation
            const hasUrl = ref.includes('http');
            const isValid = ref.length > 20 && (ref.includes('.') || ref.includes(','));
            return {
              reference: ref,
              isValid,
              url: hasUrl ? ref.match(/https?:\/\/[^\s]+/)?.[0] : null,
              error: isValid ? null : 'Invalid reference format'
            };
          }
        } catch (error) {
          return {
            reference: ref,
            isValid: false,
            error: 'Validation failed'
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Reference validation error:', error);
    return NextResponse.json({ results: [] });
  }
}