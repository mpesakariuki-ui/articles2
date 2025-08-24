import { callCustomAI } from '@/lib/ai-config';

interface RecommendationInput {
  favoriteCategories: string[];
  readingHistory: string[];
  completionRate: number;
}

export async function generateRecommendations(input: RecommendationInput) {
  try {
    const prompt = `Based on a user's reading behavior, generate 3 personalized article recommendations.

User Profile:
- Favorite categories: ${input.favoriteCategories.join(', ')}
- Recently read: ${input.readingHistory.join(', ')}
- Completion rate: ${input.completionRate}%

Generate 3 article title recommendations that would interest this user. Focus on:
1. Their favorite categories
2. Related topics they haven't explored
3. Appropriate difficulty based on completion rate

Format as a simple list of titles, one per line.`;

    const response = await callCustomAI(prompt, '', async () => {
      return 'Unable to generate recommendations at this time.';
    });

    const recommendations = response
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line)
      .slice(0, 3);

    return {
      recommendations: recommendations.length > 0 ? recommendations : [
        'Explore new topics in your favorite categories',
        'Discover trending articles in your field',
        'Continue your learning journey with curated content'
      ]
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