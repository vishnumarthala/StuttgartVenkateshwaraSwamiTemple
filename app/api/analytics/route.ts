import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total donations
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('amount, tier_name, created_at')
      .eq('status', 'completed');

    if (donationsError) throw donationsError;

    // Calculate analytics
    const totalFunds = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
    const donationCount = donations?.length || 0;

    // Get by tier
    const byTier = donations?.reduce((acc, d) => {
      const tier = d.tier_name;
      if (!acc[tier]) {
        acc[tier] = { count: 0, total: 0 };
      }
      acc[tier].count++;
      acc[tier].total += Number(d.amount);
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    // Get recent donations (last 10)
    const { data: recentDonations } = await supabase
      .from('donations')
      .select('donor_name, amount, tier_name, created_at')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      totalFunds,
      donationCount,
      byTier,
      recentDonations,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
