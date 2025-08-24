import { NextRequest, NextResponse } from 'next/server';
import { getResearchPaper } from '@/lib/research';

export async function POST(request: NextRequest) {
  try {
    const { paperId, format } = await request.json();
    const paper = await getResearchPaper(paperId);
    
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    const content = generatePaperContent(paper);
    
    if (format === 'pdf') {
      // Simple text-based PDF simulation
      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', `attachment; filename="${(paper as any).title || 'paper'}.pdf"`);
      
      return new NextResponse(content, { headers });
    } else if (format === 'docx') {
      // Simple text-based Word simulation
      const headers = new Headers();
      headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      headers.set('Content-Disposition', `attachment; filename="${(paper as any).title || 'paper'}.docx"`);
      
      return new NextResponse(content, { headers });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

function generatePaperContent(paper: any): string {
  return `${paper.title}

Authors: ${paper.authors.join(', ')}
Institution: ${paper.institution}
Keywords: ${paper.keywords.join(', ')}

ABSTRACT
${paper.abstract}

1. INTRODUCTION
${paper.introduction}

2. METHODOLOGY
${paper.methodology}

3. RESULTS
${paper.results}

4. DISCUSSION
${paper.discussion}

5. CONCLUSION
${paper.conclusion}

REFERENCES
${paper.references}`;
}