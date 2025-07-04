'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateFullContentAndKeywords, GenerateFullContentAndKeywordsOutput } from '@/ai/flows/generate-full-content-and-keywords';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check, Wand2, FileText, Tags, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';


type State = {
  result: GenerateFullContentAndKeywordsOutput | null;
  error: string | null;
  isLoading: boolean;
};

function ContentGenerator() {
  const { appUser, user } = useAuth();
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const title = searchParams.get('title');
  const outline = searchParams.get('outline');

  const [state, setState] = useState<State>({ result: null, error: null, isLoading: false });
  const [fullContent, setFullContent] = useState('');
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);

  const hasGenerationsLeft = useMemo(() => {
    if (!appUser) return false;
    return appUser.subscription.generationsUsed < appUser.subscription.generationsLimit;
  }, [appUser]);

  const handleGeneration = async () => {
    if (!title || !outline || !user || !appUser || !db) return;

    if (!hasGenerationsLeft) {
        toast({
            variant: "destructive",
            title: "Generation Limit Reached",
            description: "You have used all your generations for this month. Please upgrade your plan.",
        });
        return;
    }

    setState({ result: null, error: null, isLoading: true });
    try {
      const result = await generateFullContentAndKeywords({ title, outline });
      
      const postCollectionRef = collection(db, 'posts');
      const newPostRef = doc(postCollectionRef);
      const userRef = doc(db, 'users', user.uid);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
            throw "User document does not exist!";
        }
        const currentGenerations = userDoc.data().subscription.generationsUsed;
        const lifetimeGenerations = userDoc.data().subscription.lifetimeGenerations;


        transaction.set(newPostRef, {
            userId: user.uid,
            title,
            outline,
            fullContent: result.fullContent,
            keywords: result.keywords,
            createdAt: serverTimestamp(),
        });

        transaction.update(userRef, {
            'subscription.generationsUsed': currentGenerations + 1,
            'subscription.lifetimeGenerations': lifetimeGenerations + 1,
        });
      });

      setState({ result, error: null, isLoading: false });
      setFullContent(result.fullContent);
      toast({
          title: "Content Generated!",
          description: "Your new blog post has been saved to your dashboard.",
      });

    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      setState({ result: null, error, isLoading: false });
      toast({ variant: 'destructive', title: 'Generation Failed', description: error });
    }
  };

  const handleCopy = (text: string, type: 'content' | 'keywords') => {
    navigator.clipboard.writeText(text);
    if (type === 'content') {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } else {
      setCopiedKeywords(true);
      setTimeout(() => setCopiedKeywords(false), 2000);
    }
  };

  if (!title || !outline) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <AlertTriangle className="text-destructive"/>
                    Missing Information
                </CardTitle>
                <CardDescription>
                    Please go back to the idea generation page and select a title first.
                </CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Generate Full Post & Keywords</CardTitle>
          <CardDescription>
            Based on your selected idea, we&apos;ll generate a full blog post and relevant SEO keywords.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <h3 className="font-bold text-lg">Selected Title</h3>
            <p className="text-muted-foreground">{title}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Outline</h3>
            <p className="text-muted-foreground">{outline}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGeneration} disabled={state.isLoading || !hasGenerationsLeft || !isFirebaseConfigured} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {state.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Full Post & Keywords
                </>
              )}
            </Button>
          </div>
          {!hasGenerationsLeft && !state.isLoading && isFirebaseConfigured && (
              <div className="flex items-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                  <ShieldAlert className="h-6 w-6" />
                  <div>
                    <p className="font-bold">You've reached your generation limit.</p>
                    <p className="text-sm">Please <Button asChild variant="link" className="p-0 h-auto text-destructive underline"><Link href="/billing">upgrade your plan</Link></Button> to continue creating content.</p>
                  </div>
              </div>
          )}
           {!isFirebaseConfigured && (
              <div className="flex items-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                  <ShieldAlert className="h-6 w-6" />
                  <div>
                    <p className="font-bold">Firebase not configured</p>
                    <p className="text-sm">Content generation and saving is disabled. Please configure Firebase.</p>
                  </div>
              </div>
          )}
        </CardContent>
      </Card>
      
      {state.error && (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2 text-destructive">
                    <AlertTriangle />
                    Generation Failed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{state.error}</p>
            </CardContent>
        </Card>
      )}

      {state.result && (
        <>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <FileText className="text-accent" />
                    Generated Blog Post
                </CardTitle>
                <div className="flex items-center justify-between">
                    <CardDescription>Your post is saved. You can edit the content below before copying.</CardDescription>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(fullContent, 'content')}>
                        {copiedContent ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copiedContent ? 'Copied!' : 'Copy Content'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea 
                    value={fullContent}
                    onChange={(e) => setFullContent(e.target.value)}
                    className="min-h-[500px] text-base"
                />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Tags className="text-accent" />
                    Best Trending Keywords
                </CardTitle>
                 <div className="flex items-center justify-between">
                    <CardDescription>Use these keywords to optimize your post for search engines.</CardDescription>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(state.result!.keywords.map(k => k.keyword).join(', '), 'keywords')}>
                        {copiedKeywords ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copiedKeywords ? 'Copied!' : 'Copy Keywords'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                {state.result.keywords.map((kw, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-background">
                         <Badge variant="secondary" className="text-base mb-2">{kw.keyword}</Badge>
                         <p className="text-sm text-muted-foreground">{kw.explanation}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
        </>
      )}
    </div>
  );
}

export default function GenerateContentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ContentGenerator />
        </Suspense>
    )
}
