'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

interface PayPalProviderProps {
  children: ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const mode = process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox';

  if (!clientId) {
    console.error('PayPal Client ID not configured');
    return <>{children}</>;
  }

  const initialOptions = {
    clientId: clientId,
    currency: 'EUR',
    intent: 'capture',
    components: 'buttons',
    vault: mode === 'live' ? false : true,
    // This tells PayPal SDK to use production or sandbox
    'data-client-token': undefined,
  };

  // Log for debugging
  console.log('PayPal Mode:', mode);
  console.log('Client ID:', clientId?.substring(0, 20) + '...');

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
