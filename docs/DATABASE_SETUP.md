# Database Setup Guide

This guide walks you through setting up the Supabase database for the temple donation system.

## Prerequisites

- Supabase account (free tier is sufficient)
- Supabase project created
- Environment variables configured

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name**: `sri-venkateshwara-temple`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
5. Click "Create new project"
6. Wait 2-3 minutes for project to provision

## Step 2: Get API Credentials

1. Navigate to **Settings** → **API**
2. Copy the following values:

   **Project URL**:
   ```
   https://your-project-id.supabase.co
   ```

   **anon/public key** (under "Project API keys"):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **service_role key** (under "Project API keys"):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Add to your `.env` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 3: Create Database Schema

1. In Supabase Dashboard, navigate to **SQL Editor**
2. Click "New query"
3. Copy and paste the following SQL script:

```sql
-- Create donations table
CREATE TABLE donations (
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

-- Create indexes for common queries
CREATE INDEX idx_donations_order_id ON donations(paypal_order_id);
CREATE INDEX idx_donations_transaction_id ON donations(paypal_transaction_id);
CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX idx_donations_tier ON donations(tier_name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (from API)
CREATE POLICY "Allow anonymous inserts" ON donations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous updates (from API)
CREATE POLICY "Allow anonymous updates" ON donations
  FOR UPDATE
  TO anon
  USING (true);

-- Policy: Allow anonymous reads (for success page)
CREATE POLICY "Allow anonymous reads" ON donations
  FOR SELECT
  TO anon
  USING (true);

-- Create analytics view for easy querying
CREATE VIEW donation_analytics AS
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
```

4. Click "Run" or press `Ctrl+Enter`
5. Verify success message appears

## Step 4: Verify Table Creation

1. Navigate to **Table Editor** in Supabase Dashboard
2. You should see the `donations` table
3. Click on the table to view its structure
4. Verify all columns are present:
   - `id` (uuid)
   - `paypal_order_id` (text)
   - `paypal_transaction_id` (text)
   - `amount` (numeric)
   - `currency` (text)
   - `tier_name` (text)
   - `donor_name` (text)
   - `donor_email` (text)
   - `donor_gotram` (text)
   - `donor_message` (text)
   - `status` (text)
   - `tax_receipt_eligible` (bool)
   - `tax_receipt_sent` (bool)
   - `tax_receipt_sent_at` (timestamptz)
   - `created_at` (timestamptz)
   - `captured_at` (timestamptz)
   - `updated_at` (timestamptz)

## Step 5: Test Database Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open browser console (F12)

3. Try to make a test donation (use small amount)

4. Check Supabase Dashboard → **Table Editor** → **donations**

5. You should see a new row with status "pending"

6. Complete the PayPal payment

7. Refresh table - status should update to "completed"

## Step 6: Verify RLS Policies

1. Navigate to **Authentication** → **Policies**
2. Select `donations` table
3. Verify three policies exist:
   - "Allow anonymous inserts"
   - "Allow anonymous updates"
   - "Allow anonymous reads"

## Step 7: Enable Automatic Backups (Optional)

1. Navigate to **Settings** → **Database**
2. Scroll to "Point-in-Time Recovery"
3. Click "Enable PITR" (available on paid plans)
4. Or use manual backups on free tier

## Step 8: Test Analytics API

1. Open browser and navigate to:
   ```
   http://localhost:3000/api/analytics
   ```

2. You should see JSON response:
   ```json
   {
     "totalFunds": 0,
     "donationCount": 0,
     "byTier": {},
     "recentDonations": []
   }
   ```

3. After some donations, this will show real data

## Common Issues

### Issue: "relation 'donations' does not exist"

**Solution**: SQL script didn't run successfully. Re-run the script in SQL Editor.

### Issue: "RLS policy violation"

**Solution**: Ensure RLS policies were created. Run the policy creation part of the SQL script again.

### Issue: "Failed to connect to database"

**Solution**:
- Check `.env` file has correct Supabase URL
- Verify anon key is correct
- Restart development server after updating `.env`

### Issue: "INSERT permission denied"

**Solution**:
- Verify "Allow anonymous inserts" policy exists
- Check RLS is enabled on table
- Ensure using anon key (not service role key in client)

## Useful SQL Queries

### View All Donations

```sql
SELECT
  donor_name,
  donor_email,
  amount,
  tier_name,
  status,
  created_at
FROM donations
ORDER BY created_at DESC;
```

### Total Raised

```sql
SELECT
  SUM(amount) as total,
  COUNT(*) as count
FROM donations
WHERE status = 'completed';
```

### Pending Donations

```sql
SELECT *
FROM donations
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Tax Receipt Pending

```sql
SELECT
  donor_name,
  donor_email,
  amount
FROM donations
WHERE tax_receipt_eligible = true
  AND tax_receipt_sent = false
  AND status = 'completed';
```

## Data Privacy

### GDPR Compliance

If you need to delete donor data:

```sql
-- Delete specific donation
DELETE FROM donations
WHERE donor_email = 'user@example.com';

-- Or anonymize instead
UPDATE donations
SET
  donor_name = 'Anonymous',
  donor_email = 'deleted@example.com',
  donor_gotram = NULL,
  donor_message = NULL
WHERE donor_email = 'user@example.com';
```

### Data Retention

Set up automatic deletion of old data:

```sql
-- Delete donations older than 7 years (tax record requirement in Germany)
DELETE FROM donations
WHERE created_at < NOW() - INTERVAL '7 years'
  AND tax_receipt_sent = true;
```

## Backup and Restore

### Manual Backup

1. Go to **Database** → **Backups**
2. Click "Create backup"
3. Wait for completion
4. Download backup file

### Restore from Backup

1. Go to **Database** → **Backups**
2. Find backup to restore
3. Click "Restore"
4. Confirm restoration

### Export to CSV

```sql
-- Run in SQL Editor
SELECT * FROM donations;
```

Then click "Download as CSV"

## Monitoring

### Set Up Alerts

1. Navigate to **Settings** → **Alerts**
2. Create alert for:
   - High database usage
   - Failed queries
   - RLS policy violations

### View Logs

1. Navigate to **Logs** → **Postgres Logs**
2. Filter by:
   - Error level
   - Time range
   - Query type

## Next Steps

After database setup:

1. ✅ Test complete donation flow
2. ✅ Verify data appears in Supabase
3. ✅ Check analytics API returns data
4. ✅ Test success page with real transaction
5. ✅ Deploy to production
6. ✅ Add production environment variables

## Production Deployment

When deploying to Vercel/Netlify:

1. Add environment variables in deployment platform
2. Use same Supabase project (or create production project)
3. Ensure database schema is set up in production project
4. Test with small donation first

## Support

If you encounter issues:

1. Check Supabase logs in dashboard
2. Review browser console for errors
3. Verify environment variables are set
4. Check RLS policies are configured
5. Contact Supabase support if needed

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
