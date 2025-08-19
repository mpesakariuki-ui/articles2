'use server';

/**
 * @fileOverview Provides an AI-powered tool to improve writing style by suggesting enhancements for clarity, tone, and overall quality.
 *
 * - improveWritingStyle - A function that enhances the writing style of the input text.
 * - ImproveWritingStyleInput - The input type for the improveWritingStyle function.
 * - ImproveWritingStyleOutput - The return type for the improveWritingStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveWritingStyleInputSchema = z.object({
  text: z.string().describe('The text to be improved.'),
});
export type ImproveWritingStyleInput = z.infer<typeof ImproveWritingStyleInputSchema>;

const ImproveWritingStyleOutputSchema = z.object({
  improvedText: z.string().describe('The improved text with enhanced clarity, tone, and overall quality.'),
});
export type ImproveWritingStyleOutput = z.infer<typeof ImproveWritingStyleOutputSchema>;

export async function improveWritingStyle(input: ImproveWritingStyleInput): Promise<ImproveWritingStyleOutput> {
  return improveWritingStyleFlow(input);
}

const improveWritingStylePrompt = ai.definePrompt({
  name: 'improveWritingStylePrompt',
  input: {schema: ImproveWritingStyleInputSchema},
  output: {schema: ImproveWritingStyleOutputSchema},
  prompt: `You are an AI writing assistant that helps improve the style of a given text. Enhance the clarity, tone, and overall quality of the text while maintaining its original meaning. Provide the improved text as output.

Original text: {{{text}}}`,
});

const improveWritingStyleFlow = ai.defineFlow(
  {
    name: 'improveWritingStyleFlow',
    inputSchema: ImproveWritingStyleInputSchema,
    outputSchema: ImproveWritingStyleOutputSchema,
  },
  async input => {
    const {output} = await improveWritingStylePrompt(input);
    return output!;
  }
);
