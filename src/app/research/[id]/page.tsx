import { getResearchPaper } from '@/lib/research';
import { ResearchPaperView } from '@/components/research/research-paper-view';
import { notFound } from 'next/navigation';

export default async function ResearchPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = await getResearchPaper(id);

  if (!paper) {
    notFound();
  }

  return <ResearchPaperView paper={paper as any} />;
}