// Simple AI fallback responses for when API keys are not available
export function generateFallbackResponse(prompt: string, type: string): string | string[] {
  const lowerPrompt = prompt.toLowerCase();
  
  switch (type) {
    case 'define-word':
      const word = extractWordFromPrompt(lowerPrompt);
      return `${word}: A term that requires further research. Please consult a dictionary or encyclopedia for a complete definition.`;
      
    case 'ask-question':
      return "I'd be happy to help answer your question, but I need access to AI services to provide a detailed response. Please configure your AI settings or try again later.";
      
    case 'explain-text':
      return "This text passage discusses important concepts that would benefit from further analysis. Consider researching the key terms and ideas mentioned.";
      
    case 'generate-summary':
      return "This article covers several key points that are worth exploring in detail. A comprehensive summary would highlight the main arguments and supporting evidence.";
      
    case 'suggest-tags':
      return ['general', 'article', 'content', 'information', 'research'];
      
    case 'extract-concepts':
      return ['main topic', 'key concept', 'important idea', 'central theme', 'core principle'];
      
    case 'improve-content':
      return "Your content has good potential. Consider reviewing for clarity, adding supporting details, and ensuring smooth transitions between ideas.";
      
    case 'generate-excerpt':
      return "This article explores important topics and provides valuable insights for readers interested in the subject matter.";
      
    case 'citations':
      return [
        'Author, A. (2023). Relevant Research Topic. Journal of Studies.',
        'Smith, J. (2022). Understanding Key Concepts. Academic Press.',
        'Johnson, M. (2023). Modern Perspectives. Research Quarterly.'
      ];
      
    case 'discussions':
      return [
        'What are the main implications of this topic?',
        'How does this relate to current trends?',
        'What questions does this raise for future research?'
      ];
      
    default:
      return "AI services are currently unavailable. Please try again later or configure your AI settings.";
  }
}

function extractWordFromPrompt(prompt: string): string {
  const match = prompt.match(/word\s+"([^"]+)"/);
  if (match) return match[1];
  
  const words = prompt.split(' ');
  const wordIndex = words.findIndex(w => w.includes('word'));
  if (wordIndex !== -1 && wordIndex < words.length - 1) {
    return words[wordIndex + 1].replace(/['"]/g, '');
  }
  
  return 'term';
}