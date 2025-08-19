import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

interface RecommendationInput {
  favoriteCategories: string[];
  readingHistory: string[];
  completionRate: number;
}

export async function generateRecommendations(input: RecommendationInput) {
  try {
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: `Based on a user's reading behavior, generate 3 personalized article recommendations.

User Profile:
- Favorite categories: ${input.favoriteCategories.join(', ')}
- Recently read: ${input.readingHistory.join(', ')}
- Completion rate: ${input.completionRate}%

Generate 3 article title recommendations that would interest this user. Focus on:
1. Their favorite categories
2. Related topics they haven't explored
3. Appropriate difficulty based on completion rate

Format as a simple list of titles, one per line.`,
    });

    return {
      recommendations: text.split('\n').filter(line => line.trim()).slice(0, 3)
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      recommendations: [
        'Explore new topics in your favorite categories',
        'Discover trending articles in your field',
        'Continue your learning journey with curated content'
      ]
    };
  }
}