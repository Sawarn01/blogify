const { NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } = process.env;

if (!NEXT_PUBLIC_PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_API_URL) {
    throw new Error("PayPal environment variables are not set.");
}

async function getPayPalAccessToken() {
    const auth = Buffer.from(`${NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to get PayPal access token: ${errorDetails}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function createPayPalOrder(amount: string) {
    const accessToken = await getPayPalAccessToken();
    const url = `${PAYPAL_API_URL}/v2/checkout/orders`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount,
                },
            }],
        }),
    });
    
    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to create PayPal order: ${errorDetails}`);
    }

    return response.json();
}

export async function capturePayPalOrder(orderId: string) {
    const accessToken = await getPayPalAccessToken();
    const url = `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to capture PayPal order: ${errorDetails}`);
    }

    return response.json();
}
