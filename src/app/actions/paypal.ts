'use server';

import { createPayPalOrder as createOrderApi, capturePayPalOrder as captureOrderApi } from '@/lib/paypal';

export type Plan = 'Monthly' | 'Annual';

const planPrices: Record<Plan, string> = {
    'Monthly': '9.00',
    'Annual': '49.00'
};

export async function createOrder(plan: Plan) {
    const amount = planPrices[plan];
    if (!amount) {
        throw new Error('Invalid plan selected.');
    }
    try {
        const order = await createOrderApi(amount);
        return { id: order.id };
    } catch (error) {
        console.error("Failed to create order:", error);
        throw new Error('Failed to create PayPal order.');
    }
}


export async function captureOrder(orderID: string) {
    try {
        const captureData = await captureOrderApi(orderID);
        return captureData;
    } catch (error) {
        console.error("Failed to capture order:", error);
        throw new Error('Failed to capture PayPal payment.');
    }
}
