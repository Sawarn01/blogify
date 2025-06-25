import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BillingPage() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold">Manage Subscription</h1>
            <p className="text-muted-foreground">Choose the plan that fits your needs. Unlock unlimited content generation.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Free</CardTitle>
                    <CardDescription>For getting started</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-extrabold">$0<span className="text-xl font-normal text-muted-foreground">/month</span></p>
                  <ul className="mt-6 space-y-3 text-left">
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-muted-foreground" /> 3 Generations / month</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-muted-foreground" /> Idea Generation</li>
                  </ul>
                </CardContent>
                <CardFooter>
                    <Button disabled variant="outline" className="w-full">
                        Your Current Plan
                    </Button>
                </CardFooter>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-2xl">Monthly Plan</CardTitle>
                   <CardDescription>For active creators</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-extrabold">$9<span className="text-xl font-normal text-muted-foreground">/month</span></p>
                  <ul className="mt-6 space-y-3 text-left">
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Unlimited Generations</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Full Content & Keywords</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Access to All AI Tools</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Priority Support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Subscribe with PayPal
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-primary border-2 shadow-xl relative">
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                  <Badge className="bg-primary hover:bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-2xl">Annual Plan</CardTitle>
                  <CardDescription>For professionals & teams</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-extrabold">$49<span className="text-xl font-normal text-muted-foreground">/year</span></p>
                   <p className="font-semibold text-green-600">Save over 50%!</p>
                  <ul className="mt-6 space-y-3 text-left">
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Unlimited Generations</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Full Content & Keywords</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Access to All AI Tools</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Priority Support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Subscribe with PayPal
                  </Button>
                </CardFooter>
              </Card>
        </div>
    </div>
  );
}
