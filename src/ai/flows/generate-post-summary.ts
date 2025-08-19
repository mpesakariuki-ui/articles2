// Implemented Genkit flow for summarizing a long post.

'use server';

/**
 * @fileOverview A flow that summarizes a long post using an AI-powered tool.
 *
 * - generatePostSummary - A function that generates a summary of a given post.
 * - GeneratePostSummaryInput - The input type for the generatePostSummary function.
 * - GeneratePostSummaryOutput - The return type for the generatePostSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostSummaryInputSchema = z.object({
  post: z.string().describe('The content of the post to be summarized.'),
});
export type GeneratePostSummaryInput = z.infer<typeof GeneratePostSummaryInputSchema>;

const GeneratePostSummaryOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the post.'),
});
export type GeneratePostSummaryOutput = z.infer<typeof GeneratePostSummaryOutputSchema>;

export async function generatePostSummary(input: GeneratePostSummaryInput): Promise<GeneratePostSummaryOutput> {
  return generatePostSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostSummaryPrompt',
  input: {schema: GeneratePostSummaryInputSchema},
  output: {schema: GeneratePostSummaryOutputSchema},
  prompt: `Summarize the following post in a concise and informative way. The summary should capture the key points and main ideas of the post.\n\nPost:\n{{{post}}}`,
});

const generatePostSummaryFlow = ai.defineFlow(
  {
    name: 'generatePostSummaryFlow',
    inputSchema: GeneratePostSummaryInputSchema,
    outputSchema: GeneratePostSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
