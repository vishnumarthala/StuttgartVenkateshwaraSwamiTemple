-- Migration: 002_add_donor_address_fields
-- Description: Adds address fields required for German tax receipts (Spendenbescheinigung)
-- Author: Admin Dashboard Implementation
-- Date: 2026-01-21

-- ============================================================================
-- Add donor address columns
-- ============================================================================

ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS donor_street TEXT,
ADD COLUMN IF NOT EXISTS donor_postal_code TEXT,
ADD COLUMN IF NOT EXISTS donor_city TEXT,
ADD COLUMN IF NOT EXISTS donor_country TEXT DEFAULT 'Germany';

-- ============================================================================
-- Add tax receipt document storage
-- ============================================================================

ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS tax_receipt_document_url TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- ============================================================================
-- Create index for tax receipt eligible donations
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_donations_tax_receipt_eligible 
ON donations(tax_receipt_eligible, tax_receipt_sent) 
WHERE tax_receipt_eligible = TRUE;

-- ============================================================================
-- Update RLS policies for authenticated admin access
-- ============================================================================

-- Drop existing policies if they need updating
DROP POLICY IF EXISTS "Allow authenticated full access" ON donations;

-- Policy: Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access" ON donations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Create admin_users table for role management
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin_users
CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.user_id = auth.uid()
  ));

-- Trigger for updated_at on admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comment on columns for documentation
-- ============================================================================

COMMENT ON COLUMN donations.donor_street IS 'Donor street address - required for German tax receipts';
COMMENT ON COLUMN donations.donor_postal_code IS 'Donor postal code - required for German tax receipts';
COMMENT ON COLUMN donations.donor_city IS 'Donor city - required for German tax receipts';
COMMENT ON COLUMN donations.donor_country IS 'Donor country - defaults to Germany';
COMMENT ON COLUMN donations.tax_receipt_document_url IS 'URL to stored Spendenbescheinigung PDF';
COMMENT ON COLUMN donations.admin_notes IS 'Internal admin notes about this donation';
