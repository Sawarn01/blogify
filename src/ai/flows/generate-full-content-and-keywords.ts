'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating full blog post content and relevant SEO keywords.
 *
 * - generateFullContentAndKeywords - A function that handles the generation of blog post content and keywords.
 * - GenerateFullContentAndKeywordsInput - The input type for the generateFullContentAndKeywords function.
 * - GenerateFullContentAndKeywordsOutput - The return type for the generateFullContentAndKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFullContentAndKeywordsInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  outline: z.string().describe('The outline of the blog post.'),
});
export type GenerateFullContentAndKeywordsInput = z.infer<typeof GenerateFullContentAndKeywordsInputSchema>;

const GenerateFullContentAndKeywordsOutputSchema = z.object({
  fullContent: z.string().describe('The generated full blog post content.'),
  keywords: z.array(
    z.object({
      keyword: z.string().describe('A relevant SEO keyword.'),
      explanation: z.string().describe('A brief explanation of the keyword\'s SEO value.'),
    })
  ).describe('An array of relevant SEO keywords with explanations.'),
});
export type GenerateFullContentAndKeywordsOutput = z.infer<typeof GenerateFullContentAndKeywordsOutputSchema>;

export async function generateFullContentAndKeywords(input: GenerateFullContentAndKeywordsInput): Promise<GenerateFullContentAndKeywordsOutput> {
  return generateFullContentAndKeywordsFlow(input);
}

const contentPrompt = ai.definePrompt({
  name: 'generateFullContentPrompt',
  input: {schema: GenerateFullContentAndKeywordsInputSchema},
  output: {schema: z.object({fullContent: z.string()})},
  prompt: `Write a comprehensive, SEO-optimized blog post based on the title: '{{title}}' and outline: '{{outline}}'. Ensure it is engaging, informative, and uses natural language. Aim for approximately 800-1000 words. Include an introduction, several main sections with relevant subheadings, and a concise conclusion.`,
});

const keywordsPrompt = ai.definePrompt({
  name: 'generateKeywordsPrompt',
  input: {schema: GenerateFullContentAndKeywordsInputSchema},
  output: {schema: z.object({keywords: z.array(
    z.object({
      keyword: z.string().describe('A relevant SEO keyword.'),
      explanation: z.string().describe('A brief explanation of the keyword\'s SEO value.'),
    })
  )})},
  prompt: `Based on the blog post topic '{{title}}' and the general content theme, suggest 5-7 trending, long-tail keywords with low competition that could easily rank on Google. For each keyword, provide a very brief explanation (1-2 sentences) of why it's a good choice for SEO.`,
});

const generateFullContentAndKeywordsFlow = ai.defineFlow(
  {
    name: 'generateFullContentAndKeywordsFlow',
    inputSchema: GenerateFullContentAndKeywordsInputSchema,
    outputSchema: GenerateFullContentAndKeywordsOutputSchema,
  },
  async input => {
    const [contentResult, keywordsResult] = await Promise.all([
      contentPrompt(input),
      keywordsPrompt(input),
    ]);

    return {
      fullContent: contentResult.output!.fullContent,
      keywords: keywordsResult.output!.keywords,
    };
  }
);
