import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const result = await capturePayPalOrder(body.orderId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to capture payment'
        },
        { status: 400 }
      );
    }

    // Update donation status to completed in Supabase
    try {
      const { data: donation, error } = await supabase
        .from('donations')
        .update({
          paypal_transaction_id: result.transactionId,
          status: 'completed',
          captured_at: new Date().toISOString(),
        })
        .eq('paypal_order_id', body.orderId)
        .select()
        .single();

      if (error) {
        console.error('Failed to update donation status:', error);
        // Payment succeeded but DB update failed - log for reconciliation
      } else {
        console.log('Donation completed:', {
          id: donation.id,
          transactionId: result.transactionId,
          amount: donation.amount,
          donor: donation.donor_name
        });

        // TODO: Trigger email notification here (future enhancement)
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Payment succeeded - continue
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
    });
  } catch (error) {
    console.error('Error in capture-order API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to capture payment'
      },
      { status: 500 }
    );
  }
}
