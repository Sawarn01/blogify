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
  ChevronDown,
  User,
  Badge,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
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

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/generate/ideas',
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
                <Link href={item.href}>
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
                    <SidebarMenuButton asChild tooltip={{children: 'Logout'}}>
                        <Link href="/">
                            <LogOut/>
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="user avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">user@example.com</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Free Plan
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
    )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Get cookie for defaultOpen state
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedState = document.cookie.split('; ').find(row => row.startsWith('sidebar_state='));
        if (savedState) {
            setDefaultOpen(savedState.split('=')[1] === 'true');
        }
    }
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 sticky top-0 z-40">
                <SidebarTrigger className="md:hidden"/>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold md:text-xl font-headline">
                        {menuItems.find(item => item.href === usePathname())?.label || 'Dashboard'}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">3 / 3 Generations Left</Badge>
                  <Button asChild size="sm">
                    <Link href="/billing">Upgrade</Link>
                  </Button>
                </div>
                <UserMenu />
            </header>
            <main className="flex-1 p-4 sm:p-6 bg-secondary/50">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
