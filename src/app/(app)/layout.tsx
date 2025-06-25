'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  LayoutDashboard,
  FilePlus2,
  Settings,
  CreditCard,
  LogOut,
  User,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/generate',
    label: 'Generate Post',
    icon: FilePlus2,
  },
  {
    href: '/account',
    label: 'Account Settings',
    icon: Settings,
  },
  {
    href: '/billing',
    label: 'Billing',
    icon: CreditCard,
  },
];

function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error: any) {
        toast({ variant: "destructive", title: "Logout Failed", description: error.message });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          {open && <span className="font-bold text-lg font-headline">Blogify AI</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href === '/generate' ? '/generate/ideas' : item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t -mx-2 pt-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip={{children: 'Logout'}} disabled={!isFirebaseConfigured}>
                        <LogOut/>
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function UserMenu() {
    const { appUser } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        if (!auth) return;
        try {
          await signOut(auth);
          router.push('/');
        } catch (error: any) {
            toast({ variant: "destructive", title: "Logout Failed", description: error.message });
        }
    };
    
    if (!appUser) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={appUser.photoURL || `https://placehold.co/100x100.png`} alt={appUser.displayName || 'User'} data-ai-hint="user avatar" />
                  <AvatarFallback>{appUser.displayName?.charAt(0).toUpperCase() || appUser.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{appUser.displayName || appUser.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {appUser.subscription.plan} Plan
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/account')}>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={!isFirebaseConfigured}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
    )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user && isFirebaseConfigured) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedState = document.cookie.split('; ').find(row => row.startsWith('sidebar_state='));
        if (savedState) {
            setDefaultOpen(savedState.split('=')[1] === 'true');
        }
    }
  }, []);
  
  if (loading || (!user && isFirebaseConfigured) || (!appUser && isFirebaseConfigured)) {
      return null;
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <Logo />
        <h1 className="text-2xl font-bold font-headline">Welcome to Blogify AI</h1>
        <p className="max-w-md text-muted-foreground">
          To get started, please configure your Firebase credentials in a <strong>.env</strong> file. Check the browser console for more details and instructions.
        </p>
        <div className="mt-4">
            {children}
        </div>
      </div>
    )
  }
  
  const generationsLeft = appUser.subscription.generationsLimit - appUser.subscription.generationsUsed;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 sticky top-0 z-40">
                <SidebarTrigger className="md:hidden"/>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold md:text-xl font-headline">
                        {menuItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{generationsLeft} / {appUser.subscription.generationsLimit} Generations Left</Badge>
                  {appUser.subscription.plan === 'Free' && (
                    <Button asChild size="sm">
                        <Link href="/billing">Upgrade</Link>
                    </Button>
                  )}
                </div>
                <UserMenu />
            </header>
            <main className="flex-1 p-4 sm:p-6 bg-secondary/50 min-h-[calc(100vh-3.5rem)]">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
