'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
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
        if (!auth) {
            toast({ variant: 'destructive', title: 'Error', description: 'Authentication is not configured.' });
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged in useAuth will handle the redirect and data creation
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Login failed', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!auth) {
             toast({ variant: 'destructive', title: 'Error', description: 'Authentication is not configured.' });
            return;
        }
        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // onAuthStateChanged in useAuth will handle the redirect and data creation
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
            {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <GoogleIcon className="h-4 w-4" />}
            <span>Sign in with Google</span>
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
                {isLoading && <Loader2 className="h-4 w-4 animate-spin"/>}
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
