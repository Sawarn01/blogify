'use client';
import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateBlogIdeas, GenerateBlogIdeasOutput } from '@/ai/flows/generate-blog-ideas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
import Link from 'next/link';

type FormState = {
  ideas: GenerateBlogIdeasOutput | null;
  error: string | null;
};

async function generateIdeasAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const topic = formData.get('topic') as string;
  const targetAudience = formData.get('targetAudience') as string;

  if (!topic) {
    return { ideas: null, error: 'Topic is required.' };
  }

  try {
    const ideas = await generateBlogIdeas({ topic, targetAudience });
    return { ideas, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { ideas: null, error };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Ideas
        </>
      )}
    </Button>
  );
}

export default function GenerateIdeasPage() {
  const initialState: FormState = { ideas: null, error: null };
  const [state, formAction] = useActionState(generateIdeasAction, initialState);

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Generate Blog Ideas</CardTitle>
          <CardDescription>
            Enter a topic and target audience to brainstorm engaging blog post titles and outlines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="topic">Topic / Industry</Label>
                <Input name="topic" id="topic" placeholder="e.g., 'sustainable living'" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
                <Input name="targetAudience" id="targetAudience" placeholder="e.g., 'beginners'" />
              </div>
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
      
      {state.ideas && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Lightbulb className="text-accent"/>
                    Generated Ideas
                </CardTitle>
                <CardDescription>
                    Select a title to generate the full blog post and keywords.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {state.ideas.map((idea, index) => (
                        <div key={index} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background">
                            <div className="flex-1">
                                <h3 className="font-bold">{idea.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{idea.outline}</p>
                            </div>
                            <Button asChild variant="secondary" className="w-full sm:w-auto">
                                <Link href={`/generate/content?title=${encodeURIComponent(idea.title)}&outline=${encodeURIComponent(idea.outline)}`}>
                                    Select & Generate Content
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
