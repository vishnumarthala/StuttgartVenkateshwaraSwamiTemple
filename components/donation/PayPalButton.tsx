'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { DonorInfo } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  tierName: string;
  donorInfo: DonorInfo;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PayPalButton({
  amount,
  tierName,
  donorInfo,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          <p className="font-semibold mb-1">Payment Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm underline mt-2 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}
      {isProcessing && (
        <div className="text-center text-sm text-gray-600 mb-2">
          Processing your payment...
        </div>
      )}
      <PayPalButtons
        fundingSource={undefined}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={async () => {
          try {
            setError(null);
            setIsProcessing(true);
            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount,
                tierName,
                donorInfo,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to create order');
            }

            const data = await response.json();
            return data.orderId;
          } catch (error) {
            setIsProcessing(false);
            const errorMessage =
              error instanceof Error ? error.message : 'Failed to create order. Please check your connection and try again.';
            setError(errorMessage);
            if (onError) {
              onError(errorMessage);
            }
            throw error;
          }
        }}
        onApprove={async (data) => {
          try {
            const response = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: data.orderID,
              }),
            });

            const result = await response.json();

            if (!result.success) {
              throw new Error(result.error || 'Failed to capture payment');
            }

            // Success - redirect to success page
            if (onSuccess) {
              onSuccess();
            }

            const successUrl = new URLSearchParams({
              transactionId: result.transactionId || data.orderID,
              amount: amount.toString(),
              tierName: tierName,
            });

            router.push(`/donate/success?${successUrl.toString()}`);
          } catch (error) {
            setIsProcessing(false);
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Failed to complete payment. Please try again or contact support.';
            setError(errorMessage);
            if (onError) {
              onError(errorMessage);
            }
          }
        }}
        onCancel={() => {
          setIsProcessing(false);
          setError('Payment was cancelled. You can try again when ready.');
        }}
        onError={(err) => {
          setIsProcessing(false);
          console.error('PayPal error:', err);
          const errorMessage = 'An error occurred with PayPal. This might be due to configuration issues. Please contact support if the problem persists.';
          setError(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
        }}
      />
    </div>
  );
}
