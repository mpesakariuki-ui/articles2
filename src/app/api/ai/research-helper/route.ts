import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

const sectionPrompts = {
  abstract: 'Write a compelling abstract that summarizes the research purpose, methods, key findings, and implications. Keep it concise (150-250 words).',
  introduction: 'Write an introduction that provides background context, identifies the research gap, states the research question/hypothesis, and outlines the paper structure.',
  methodology: 'Describe the research methodology including study design, data collection methods, sample size, analysis techniques, and any limitations.',
  results: 'Present the key findings clearly with specific data, statistics, and observations. Focus on factual reporting without interpretation.',
  discussion: 'Interpret the results, compare with existing literature, discuss implications, acknowledge limitations, and suggest future research directions.',
  conclusion: 'Summarize the main findings, restate their significance, and provide final thoughts on the research contribution.',
  references: 'Format references in proper academic style (APA/MLA). Include recent, credible sources relevant to your research topic.'
};

export async function POST(request: NextRequest) {
  try {
    const { section, currentContent } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const sectionGuidance = sectionPrompts[section as keyof typeof sectionPrompts] || 'Provide helpful writing suggestions for this section.';
    
    const prompt = `You are an academic writing assistant. Help improve this ${section} section of a research paper.

Current content: "${currentContent}"

Guidelines: ${sectionGuidance}

Provide specific, actionable suggestions to improve this section. If the content is empty, provide a template or example structure. Focus on academic writing best practices.`;

    const result = await model.generateContent(prompt);
    const suggestion = result.response.text().trim();
    
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Research helper error:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}