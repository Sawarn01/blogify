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
    
    const handleCreateOrder = async (): Promise<string> => {
        setIsProcessing(true);
        try {
            if (!planPrices[plan]) {
                throw new Error('Invalid subscription plan selected.');
            }
            const order = await createOrder(plan);
            if (!order?.id) {
                throw new Error('Server did not return an order ID.');
            }
            return order.id;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Could not create PayPal order. Please try again.';
            toast({ variant: 'destructive', title: 'Error Creating Order', description: errorMessage });
            throw new Error(errorMessage); // Throws error for PayPal SDK to catch
        } finally {
            // Hide the loader once the order is created, so the user can interact with the PayPal UI.
            setIsProcessing(false);
        }
    };
    
    const handleOnApprove = async (data: any) => {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to subscribe.' });
            return;
        }
        
        setIsProcessing(true); // Show loader for payment capture
        try {
            const captureData = await captureOrder(data.orderID);
            
            if (captureData && captureData.status === 'COMPLETED') {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    'subscription.plan': plan,
                    'subscription.status': 'active',
                    'subscription.generationsLimit': 9999, 
                });

                toast({ title: 'Success!', description: `You have successfully subscribed to the ${plan} plan.` });
                router.push('/account');
            } else {
                 const errorDescription = captureData?.details?.[0]?.description || captureData?.message || 'Your payment was not completed. Please try again.';
                 toast({ variant: 'destructive', title: 'Payment Failed', description: errorDescription });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error Processing Payment', description: error.message || 'An error occurred while processing your payment.' });
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleOnError = (err: any) => {
        const errorMessage = err.message || 'An error occurred with the PayPal transaction. Please try again.';
        toast({ variant: 'destructive', title: 'PayPal Error', description: errorMessage });
        setIsProcessing(false);
    };

    const handleOnCancel = () => {
        setIsProcessing(false);
    }

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
                onCancel={handleOnCancel}
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
