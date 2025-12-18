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

  return (
    <div className="w-full">
      {isProcessing && (
        <div className="text-center text-sm text-gray-600 mb-2">
          Processing your payment...
        </div>
      )}
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={async () => {
          try {
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
              error instanceof Error ? error.message : 'Failed to create order';
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
                : 'Failed to complete payment';
            if (onError) {
              onError(errorMessage);
            }
            alert(
              'There was an error processing your payment. Please try again or contact support.'
            );
          }
        }}
        onCancel={() => {
          setIsProcessing(false);
          alert('Payment was cancelled. You can try again when ready.');
        }}
        onError={(err) => {
          setIsProcessing(false);
          console.error('PayPal error:', err);
          const errorMessage = 'An error occurred with PayPal. Please try again.';
          if (onError) {
            onError(errorMessage);
          }
          alert(errorMessage);
        }}
      />
    </div>
  );
}
