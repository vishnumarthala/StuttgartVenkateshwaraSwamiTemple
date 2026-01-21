import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { generateSpendenbescheinigungHTML, generateReceiptNumber } from '@/lib/spendenbescheinigung';
import siteConfig from '@/content/site-config.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const donationId = searchParams.get('donationId');

    if (!donationId) {
      return NextResponse.json(
        { error: 'Donation ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!adminData) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch the donation
    const { data: donation, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single();

    if (error || !donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Verify eligibility
    if (!donation.tax_receipt_eligible) {
      return NextResponse.json(
        { error: 'Donation is not eligible for tax receipt (below €300)' },
        { status: 400 }
      );
    }

    // Verify address exists
    if (!donation.donor_street || !donation.donor_city) {
      return NextResponse.json(
        { error: 'Donor address is incomplete. Street and city are required.' },
        { status: 400 }
      );
    }

    // Generate receipt number
    const receiptNumber = generateReceiptNumber(donation.id);

    // Generate HTML
    const html = generateSpendenbescheinigungHTML({
      donation,
      organization: {
        name: siteConfig.title,
        legalName: siteConfig.legalName,
        address: `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}, ${siteConfig.address.country}`,
        iban: siteConfig.iban,
        representative: siteConfig.representative,
      },
      receiptNumber,
    });

    // Return HTML for preview or download
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating tax receipt:', error);
    return NextResponse.json(
      { error: 'Failed to generate tax receipt' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donationId, sendEmail } = body;

    if (!donationId) {
      return NextResponse.json(
        { error: 'Donation ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    // Check if user is authenticated and admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!adminData) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch the donation
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single();

    if (fetchError || !donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Verify eligibility
    if (!donation.tax_receipt_eligible) {
      return NextResponse.json(
        { error: 'Donation is not eligible for tax receipt' },
        { status: 400 }
      );
    }

    if (!donation.donor_street || !donation.donor_city) {
      return NextResponse.json(
        { error: 'Donor address is incomplete' },
        { status: 400 }
      );
    }

    // Mark as sent
    const { error: updateError } = await supabase
      .from('donations')
      .update({
        tax_receipt_sent: true,
        tax_receipt_sent_at: new Date().toISOString(),
      })
      .eq('id', donationId);

    if (updateError) {
      console.error('Error updating donation:', updateError);
      return NextResponse.json(
        { error: 'Failed to update donation status' },
        { status: 500 }
      );
    }

    // TODO: If sendEmail is true, send the receipt via email
    // This would integrate with the Resend email service

    return NextResponse.json({
      success: true,
      message: 'Tax receipt marked as sent',
      receiptNumber: generateReceiptNumber(donationId),
    });
  } catch (error) {
    console.error('Error processing tax receipt:', error);
    return NextResponse.json(
      { error: 'Failed to process tax receipt' },
      { status: 500 }
    );
  }
}
