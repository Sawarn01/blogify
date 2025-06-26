'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { createOrder, captureOrder } from '@/app/actions/paypal';
import type { Plan } from '@/app/actions/paypal';

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

function PayPalButtonWrapper({ plan, variant = 'default' }: { plan: Plan, variant?: 'default' | 'primary' }) {
    const { toast } = useToast();
    const router = useRouter();
    const { user, appUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleCreateOrder = async () => {
        if (!planPrices[plan]) {
             toast({ variant: 'destructive', title: 'Error', description: 'Invalid subscription plan selected.' });
             return '';
        }
        setIsProcessing(true);
        try {
            const order = await createOrder(plan);
            return order.id;
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not create PayPal order. Please try again.' });
            setIsProcessing(false);
            return '';
        }
    };
    
    const handleOnApprove = async (data: any) => {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to subscribe.' });
            setIsProcessing(false);
            return;
        }

        try {
            const captureData = await captureOrder(data.orderID);
            
            if (captureData && captureData.status === 'COMPLETED') {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    'subscription.plan': plan,
                    'subscription.status': 'active',
                    // This simulates a subscription by unlocking features.
                    // For real recurring subscriptions, a more complex setup with webhooks is needed.
                    'subscription.generationsLimit': 9999, 
                });

                toast({ title: 'Success!', description: `You have successfully subscribed to the ${plan} plan.` });
                router.push('/account');
            } else {
                 toast({ variant: 'destructive', title: 'Payment Failed', description: captureData.error?.message || 'Your payment was not completed. Please try again.' });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'An error occurred while processing your payment.' });
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleOnError = (err: any) => {
        toast({ variant: 'destructive', title: 'PayPal Error', description: 'An error occurred with the PayPal transaction. Please try again.' });
        setIsProcessing(false);
    };

    if (!user || !appUser) {
         return <Button disabled className="w-full">Loading User...</Button>
    }

    if (appUser.subscription.plan !== 'Free' && appUser.subscription.plan === plan) {
        return <Button disabled variant="outline" className="w-full">Your Current Plan</Button>;
    }


    return (
        <div className="w-full relative">
            {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            )}
            <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={handleCreateOrder}
                onApprove={handleOnApprove}
                onError={handleOnError}
                disabled={isProcessing}
                forceReRender={[plan]}
            />
        </div>
    );
}

const planPrices: Record<Plan, string> = {
    'Monthly': '9.00',
    'Annual': '49.00'
};

export default function BillingPage() {
    const { appUser } = useAuth();

    if (!isFirebaseConfigured) {
        return (
             <div>
                 <div className="mb-8">
                    <h1 className="font-headline text-3xl font-bold">Manage Subscription</h1>
                    <p className="text-muted-foreground">Firebase is not configured.</p>
                </div>
            </div>
        )
    }

    if (!paypalClientId) {
        return (
            <div>
                 <div className="mb-8">
                    <h1 className="font-headline text-3xl font-bold">Manage Subscription</h1>
                    <p className="text-muted-foreground">Payment processing is currently unavailable because the PayPal client ID is missing.</p>
                </div>
            </div>
        )
    }
    
    const paypalOptions: ReactPayPalScriptOptions = {
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture",
    };

  return (
    <PayPalScriptProvider options={paypalOptions}>
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
                           {appUser?.subscription.plan === 'Free' ? 'Your Current Plan' : 'Free Plan'}
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
                        <PayPalButtonWrapper plan="Monthly" />
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
                      <PayPalButtonWrapper plan="Annual" variant="primary" />
                    </CardFooter>
                  </Card>
            </div>
        </div>
    </PayPalScriptProvider>
  );
}
