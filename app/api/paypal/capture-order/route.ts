import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { supabase } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { generateDonationConfirmationEmail } from '@/lib/email-templates';

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

        // Send confirmation email to donor
        try {
          const emailHtml = generateDonationConfirmationEmail({
            donorName: donation.donor_name,
            donorEmail: donation.donor_email,
            amount: donation.amount,
            currency: donation.currency,
            tierName: donation.tier_name,
            transactionId: result.transactionId || donation.paypal_transaction_id || 'N/A',
            donatedAt: donation.captured_at || new Date().toISOString(),
            gotram: donation.donor_gotram || undefined,
            message: donation.donor_message || undefined,
          });

          const emailResult = await resend.emails.send({
            from: 'Sri Venkateshwara Temple Stuttgart <noreply@svtstuttgart.de>',
            to: donation.donor_email,
            subject: 'Thank You for Your Donation - Sri Venkateshwara Temple Stuttgart',
            html: emailHtml,
          });

          console.log('Confirmation email sent:', {
            emailId: emailResult.data?.id,
            recipient: donation.donor_email
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't fail the entire request if email fails
        }
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
