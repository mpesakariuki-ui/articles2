import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { references } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const referenceUrls = await Promise.all(
      references.map(async (reference: string) => {
        try {
          const prompt = `For this academic reference: "${reference}"

Find potential URLs where this content might be available online. Suggest 2-3 likely URLs based on:
- Academic databases (Google Scholar, ResearchGate, etc.)
- Publisher websites
- Institutional repositories
- DOI links if applicable

Return only the URLs, one per line. If no specific URLs can be determined, suggest general search strategies.`;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text().trim();
          
          const urls = responseText
            .split('\n')
            .filter(line => line.trim())
            .filter(line => line.includes('http') || line.includes('www'))
            .slice(0, 3);
          
          return {
            reference,
            urls,
            status: urls.length > 0 ? 'found' : 'not_found'
          };
        } catch (error) {
          return {
            reference,
            urls: [],
            status: 'not_found'
          };
        }
      })
    );
    
    return NextResponse.json({ referenceUrls });
  } catch (error) {
    console.error('Error finding reference URLs:', error);
    return NextResponse.json({ error: 'Failed to find reference URLs' }, { status: 500 });
  }
}