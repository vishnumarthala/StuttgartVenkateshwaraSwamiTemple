import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { supabase } from '@/lib/supabase';
import { PayPalOrderRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: PayPalOrderRequest = await request.json();

    // Validate request body
    if (!body.amount || !body.tierName || !body.donorInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate donor info
    if (!body.donorInfo.name || !body.donorInfo.email) {
      return NextResponse.json(
        { error: 'Donor name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.donorInfo.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate amount (must be positive)
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create description for PayPal order
    const description = `Donation - ${body.tierName} | ${body.donorInfo.name}`;

    // Create PayPal order
    const orderId = await createPayPalOrder(body.amount, description);

    // Insert pending donation to Supabase
    try {
      const { data: donation, error } = await supabase
        .from('donations')
        .insert({
          paypal_order_id: orderId,
          amount: body.amount,
          currency: 'EUR',
          tier_name: body.tierName,
          donor_name: body.donorInfo.name,
          donor_email: body.donorInfo.email,
          donor_gotram: body.donorInfo.gotram || null,
          donor_message: body.donorInfo.message || null,
          status: 'pending',
          tax_receipt_eligible: body.amount >= 300,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save donation to database:', error);
        // Don't fail the request - PayPal order already created
        // Log for manual reconciliation
      } else {
        console.log('Donation saved to database:', donation.id);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue - payment can still proceed
    }

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error('Error in create-order API:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}
