'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export default function AccountPage() {
    const { appUser, user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    
    const isEmailProvider = user?.providerData.some(p => p.providerId === 'password');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.email || !currentPassword || !newPassword || !auth) {
            toast({ variant: 'destructive', title: 'Error', description: 'All password fields are required.' });
            return;
        }

        setIsPasswordLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            toast({ title: 'Success', description: 'Password updated successfully. Please log in again.' });
            await signOut(auth);
            router.push('/login');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Password change failed', description: error.message });
        } finally {
            setIsPasswordLoading(false);
            setCurrentPassword('');
            setNewPassword('');
        }
    };


    if (!appUser || !user) return null;
    
    const { subscription } = appUser;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Profile</CardTitle>
          <CardDescription>These details are synced from your authentication provider.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={appUser.email || ''} disabled />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" type="text" defaultValue={appUser.displayName || 'Not set'} disabled />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Subscription</CardTitle>
          <CardDescription>View your current plan and manage your subscription.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h3 className="font-semibold">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">You are currently on the <Badge variant="secondary">{subscription.plan}</Badge> plan.</p>
                </div>
                 {subscription.plan === 'Free' && (
                    <Button asChild>
                        <Link href="/billing">Upgrade Subscription</Link>
                    </Button>
                )}
            </div>
            <div className="mt-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Usage</h3>
                <p className="text-sm text-muted-foreground">You have used <span className="font-bold">{subscription.generationsUsed}</span> of your <span className="font-bold">{subscription.generationsLimit}</span> generations this month.</p>
                <p className="text-sm text-muted-foreground mt-2">Lifetime generations: <span className="font-bold">{subscription.lifetimeGenerations}</span>.</p>
            </div>
        </CardContent>
      </Card>

      {isEmailProvider && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Password</CardTitle>
            <CardDescription>Change your password here. After saving, you will be logged out.</CardDescription>
          </CardHeader>
          <form onSubmit={handleChangePassword}>
              <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={isPasswordLoading || !isFirebaseConfigured} required />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isPasswordLoading || !isFirebaseConfigured} required />
                  </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isPasswordLoading || !isFirebaseConfigured}>
                  {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
              </Button>
              </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
