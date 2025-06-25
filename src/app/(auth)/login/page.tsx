'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.545 6.558C16.803 5.263 18.22 4.455 19.89 4.184A9.916 9.916 0 0 1 22 14c0 2.22-.72 4.29-1.94 5.92-.23.3-.47.58-.7.86A9.94 9.94 0 0 1 12 22a10 10 0 0 1-9.5-6.635C2.022 13.886 2 12.95 2 12c0-2.31.65-4.44 1.76-6.22.2-.32.43-.62.66-.92A10 10 0 0 1 12 2a9.965 9.965 0 0 1 3.545 4.558z"/><path d="M12 12h10"/>
        </svg>
    )
}

export default function LoginPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const isAuthDisabled = !isFirebaseConfigured;

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth) return;
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Login failed', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const createNewUserDocument = async (firebaseUser: import('firebase/auth').User) => {
        if (!db) return;
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const newUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                subscription: {
                    plan: 'Free',
                    status: 'active',
                    generationsUsed: 0,
                    generationsLimit: 3,
                    lifetimeGenerations: 0,
                },
            };
            await setDoc(userDocRef, newUser);
        }
    };

    const handleGoogleLogin = async () => {
        if (!auth) return;
        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await createNewUserDocument(result.user);
            router.push('/dashboard');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Google Sign-in failed', description: error.message });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    if (loading || user) {
        return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>;
    }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading || isAuthDisabled}>
            {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <GoogleIcon />}
            <span className="ml-2">Sign in with Google</span>
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading || isGoogleLoading || isAuthDisabled}/>
            </div>
            <div className="grid gap-2">
            <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
                </Link>
            </div>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading || isGoogleLoading || isAuthDisabled} />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || isGoogleLoading || isAuthDisabled}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Login
            </Button>
        </form>
         {isAuthDisabled && (
            <p className="text-center text-xs text-destructive">
                Firebase is not configured. Authentication is disabled.
            </p>
        )}
      </CardContent>
      <CardFooter>
         <div className="text-center text-sm w-full">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
