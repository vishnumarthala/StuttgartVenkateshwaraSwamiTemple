function getPayPalMode(): 'sandbox' | 'live' {
  const mode = (process.env.PAYPAL_MODE || process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox').toLowerCase();
  return mode === 'live' ? 'live' : 'sandbox';
}

function getPayPalApiBase(): string {
  return getPayPalMode() === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  // Check if we have a cached token that's still valid
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  // Server-side credentials (do NOT expose secrets to the browser)
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET (and optionally PAYPAL_MODE).'
    );
  }

  // Validate that secret is not the same as client ID
  if (clientSecret === clientId) {
    throw new Error(
      'PayPal Client Secret is incorrectly set to the same value as Client ID. Get the actual secret from PayPal Dashboard.'
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the token (expires in seconds, convert to milliseconds)
    cachedAccessToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000, // Subtract 60s for safety margin
    };

    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw new Error('Failed to authenticate with PayPal');
  }
}

export async function createPayPalOrder(
  amount: number,
  description: string
): Promise<string> {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: amount.toFixed(2),
            },
            description: description,
          },
        ],
        application_context: {
          brand_name: 'Sri Venkateshwara Temple Stuttgart',
          locale: 'de-DE',
          landing_page: 'NO_PREFERENCE',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal order creation failed:', errorData);
      throw new Error('Failed to create PayPal order');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
}> {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await fetch(
      `${getPayPalApiBase()}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal capture failed:', data);
      return {
        success: false,
        error: data.message || 'Failed to capture payment',
      };
    }

    // Extract transaction ID from the capture response
    const transactionId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    if (data.status === 'COMPLETED') {
      return {
        success: true,
        transactionId,
      };
    } else {
      return {
        success: false,
        error: `Payment status: ${data.status}`,
      };
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  // This is a placeholder for webhook verification
  // Implement proper webhook signature verification when setting up webhooks
  // See: https://developer.paypal.com/api/rest/webhooks/

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    console.warn('PAYPAL_WEBHOOK_ID not configured, skipping verification');
    return true; // For now, accept all webhooks if not configured
  }

  // TODO: Implement proper webhook signature verification
  // This requires the webhook ID from PayPal dashboard and signature validation

  return true;
}
