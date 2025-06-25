import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Profile</CardTitle>
          <CardDescription>Manage your account settings and email address.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="user@example.com" disabled />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Changes</Button>
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
                    <p className="text-sm text-muted-foreground">Your are currently on the <Badge variant="secondary">Free</Badge> plan.</p>
                </div>
                 <Button asChild>
                    <Link href="/billing">Upgrade/Manage Subscription</Link>
                </Button>
            </div>
            <div className="mt-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Usage</h3>
                <p className="text-sm text-muted-foreground">You have used <span className="font-bold">0</span> of your <span className="font-bold">3</span> free generations this month.</p>
                <p className="text-sm text-muted-foreground mt-2">Lifetime generations: <span className="font-bold">3</span>.</p>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Password</CardTitle>
          <CardDescription>Change your password here. After saving, you will be logged out.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Change Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
