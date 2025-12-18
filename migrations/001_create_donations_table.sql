-- Migration: 001_create_donations_table
-- Description: Creates the donations table with all necessary indexes, triggers, and RLS policies
-- Author: Claude AI
-- Date: 2025-01-18

-- ============================================================================
-- Create donations table
-- ============================================================================

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- PayPal identifiers
  paypal_order_id TEXT UNIQUE NOT NULL,
  paypal_transaction_id TEXT UNIQUE,

  -- Donation details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR' NOT NULL,
  tier_name TEXT NOT NULL,

  -- Donor information
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_gotram TEXT,
  donor_message TEXT,

  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),

  -- Tax receipt tracking
  tax_receipt_eligible BOOLEAN DEFAULT FALSE,
  tax_receipt_sent BOOLEAN DEFAULT FALSE,
  tax_receipt_sent_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- Create indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_donations_order_id ON donations(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_id ON donations(paypal_transaction_id);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_tier ON donations(tier_name);

-- ============================================================================
-- Create updated_at trigger function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Create trigger for automatic updated_at
-- ============================================================================

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON donations;
DROP POLICY IF EXISTS "Allow anonymous updates" ON donations;
DROP POLICY IF EXISTS "Allow anonymous reads" ON donations;

-- Policy: Allow anonymous inserts (from API routes)
CREATE POLICY "Allow anonymous inserts" ON donations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous updates (from API routes)
CREATE POLICY "Allow anonymous updates" ON donations
  FOR UPDATE
  TO anon
  USING (true);

-- Policy: Allow anonymous reads (for success page and analytics)
CREATE POLICY "Allow anonymous reads" ON donations
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- Create analytics view
-- ============================================================================

CREATE OR REPLACE VIEW donation_analytics AS
SELECT
  tier_name,
  COUNT(*) as donation_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount,
  MIN(created_at) as first_donation,
  MAX(created_at) as last_donation
FROM donations
WHERE status = 'completed'
GROUP BY tier_name;

-- ============================================================================
-- Grant permissions on the view
-- ============================================================================

GRANT SELECT ON donation_analytics TO anon;
GRANT SELECT ON donation_analytics TO authenticated;

-- ============================================================================
-- Migration complete
-- ============================================================================

-- Verify table was created
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'donations') THEN
    RAISE NOTICE 'Migration 001 completed successfully: donations table created';
  ELSE
    RAISE EXCEPTION 'Migration 001 failed: donations table not created';
  END IF;
END $$;
