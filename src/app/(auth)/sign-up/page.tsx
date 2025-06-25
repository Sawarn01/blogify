import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.545 6.558C16.803 5.263 18.22 4.455 19.89 4.184A9.916 9.916 0 0 1 22 14c0 2.22-.72 4.29-1.94 5.92-.23.3-.47.58-.7.86A9.94 9.94 0 0 1 12 22a10 10 0 0 1-9.5-6.635C2.022 13.886 2 12.95 2 12c0-2.31.65-4.44 1.76-6.22.2-.32.43-.62.66-.92A10 10 0 0 1 12 2a9.965 9.965 0 0 1 3.545 4.558z"/><path d="M12 12h10"/>
        </svg>
    )
}

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
        <CardDescription>
          Create an account to start generating blog posts with AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="w-full">
          <GoogleIcon />
          <span className="ml-2">Sign up with Google</span>
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
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Create account
        </Button>
      </CardContent>
       <CardFooter className="flex-col items-start gap-2 text-sm">
        <p className="text-muted-foreground">
            By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
        <div className="text-center w-full">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
