import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-secondary p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-lg font-headline">Blogify AI</span>
          </Link>
        </div>
      {children}
    </div>
  );
}
