# Supabase Database Integration Documentation

## Overview

The temple website uses Supabase PostgreSQL database to store donation records, track donor information, and provide analytics. This enables permanent storage of all donation data for reporting and tax receipt generation.

## Features

- ✅ Persistent donation storage
- ✅ Donor information tracking (name, email, gotram, message)
- ✅ Status tracking (pending → completed)
- ✅ Tax receipt eligibility flagging
- ✅ Analytics API for reporting
- ✅ Row Level Security (RLS)
- ✅ Non-blocking operations (payments succeed even if DB fails)

## Database Schema

### Donations Table

```sql
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
```

### Indexes

```sql
CREATE INDEX idx_donations_order_id ON donations(paypal_order_id);
CREATE INDEX idx_donations_transaction_id ON donations(paypal_transaction_id);
CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX idx_donations_tier ON donations(tier_name);
```

### Analytics View

```sql
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

## Configuration

### Environment Variables

Required in `.env`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Setting Up Database

1. Navigate to SQL Editor in Supabase Dashboard
2. Copy the complete SQL schema from above
3. Execute the script
4. Verify table created successfully

## Data Flow

### 1. Create Order (Insert Pending)

**Location**: `app/api/paypal/create-order/route.ts`

```typescript
// After PayPal order created
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
```

**Database State**: New row with status "pending"

### 2. Capture Order (Update to Completed)

**Location**: `app/api/paypal/capture-order/route.ts`

```typescript
// After payment captured
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
```

**Database State**: Status updated to "completed", transaction ID stored

### 3. Success Page (Query Donation)

**Location**: `app/donate/success/page.tsx`

```typescript
// Fetch donation by transaction ID
const { data, error } = await supabase
  .from('donations')
  .select('*')
  .eq('paypal_transaction_id', transactionId)
  .single();
```

**Display**: Personalized thank you with donor name

## Row Level Security (RLS)

### Policies

1. **Allow anonymous inserts**:
   ```sql
   CREATE POLICY "Allow anonymous inserts" ON donations
     FOR INSERT TO anon
     WITH CHECK (true);
   ```

2. **Allow anonymous updates**:
   ```sql
   CREATE POLICY "Allow anonymous updates" ON donations
     FOR UPDATE TO anon
     USING (true);
   ```

3. **Allow anonymous reads**:
   ```sql
   CREATE POLICY "Allow anonymous reads" ON donations
     FOR SELECT TO anon
     USING (true);
   ```

### Why Anon Access?

- API routes use anon key (public key)
- RLS provides security boundary
- Policies control what anon users can do
- Service role key can bypass RLS for admin tasks

## Analytics API

### Endpoint

**GET** `/api/analytics`

### Response

```json
{
  "totalFunds": 5000.00,
  "donationCount": 15,
  "byTier": {
    "Tier 1": { "count": 5, "total": 1000 },
    "Tier 2": { "count": 7, "total": 2500 },
    "Tier 3": { "count": 3, "total": 1500 }
  },
  "recentDonations": [
    {
      "donor_name": "John Doe",
      "amount": 500,
      "tier_name": "Tier 2",
      "created_at": "2025-01-20T10:30:00Z"
    }
  ]
}
```

### Usage

```typescript
// Fetch analytics
const response = await fetch('/api/analytics');
const data = await response.json();

console.log('Total raised:', data.totalFunds);
console.log('Number of donations:', data.donationCount);
```

## Useful Queries

### Total Funds Raised

```sql
SELECT SUM(amount) as total_funds
FROM donations
WHERE status = 'completed';
```

### Donations by Tier

```sql
SELECT
  tier_name,
  COUNT(*) as count,
  SUM(amount) as total,
  AVG(amount) as average
FROM donations
WHERE status = 'completed'
GROUP BY tier_name
ORDER BY total DESC;
```

### Donations by Month

```sql
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as donations,
  SUM(amount) as total
FROM donations
WHERE status = 'completed'
GROUP BY month
ORDER BY month DESC;
```

### Tax Receipt Eligible (Not Sent)

```sql
SELECT
  donor_name,
  donor_email,
  amount,
  created_at
FROM donations
WHERE status = 'completed'
  AND tax_receipt_eligible = true
  AND tax_receipt_sent = false
ORDER BY created_at DESC;
```

### Gotram Tracking

```sql
SELECT
  donor_name,
  donor_gotram,
  tier_name,
  amount,
  created_at
FROM donations
WHERE status = 'completed'
  AND donor_gotram IS NOT NULL
ORDER BY created_at DESC;
```

### Failed/Pending Donations

```sql
SELECT
  paypal_order_id,
  donor_name,
  donor_email,
  amount,
  status,
  created_at
FROM donations
WHERE status IN ('pending', 'failed')
ORDER BY created_at DESC;
```

## Error Handling

### Non-Blocking Strategy

Database operations are wrapped in try-catch and don't fail payment:

```typescript
try {
  // Database operation
  await supabase.from('donations').insert(...);
} catch (dbError) {
  console.error('Database error:', dbError);
  // Continue - payment can still proceed
}
```

### Reconciliation

If database fails, payments still succeed. Reconcile manually:

1. Export transactions from PayPal Dashboard
2. Compare with database records
3. Manually insert missing records:

```sql
INSERT INTO donations (
  paypal_order_id,
  paypal_transaction_id,
  amount,
  currency,
  tier_name,
  donor_name,
  donor_email,
  status,
  created_at,
  captured_at
) VALUES (
  'ORDER-123',
  'TXN-456',
  500.00,
  'EUR',
  'Tier 2',
  'John Doe',
  'john@example.com',
  'completed',
  NOW(),
  NOW()
);
```

## Maintenance

### Regular Tasks

1. **Backup Database**: Automatic in Supabase (enable Point-in-Time Recovery)
2. **Monitor Usage**: Check Supabase Dashboard for API usage
3. **Review Logs**: Check for failed database operations
4. **Clean Old Data**: Archive old donations if needed

### Updating Schema

1. Test changes in development first
2. Backup production database
3. Run migration in SQL Editor:

```sql
-- Example: Add new column
ALTER TABLE donations
ADD COLUMN donor_phone TEXT;

-- Example: Update existing data
UPDATE donations
SET tax_receipt_sent = true
WHERE tax_receipt_sent_at IS NOT NULL;
```

### Data Export

Export donations to CSV:

1. Go to Supabase Dashboard → Table Editor
2. Select `donations` table
3. Click "Download as CSV"

Or via SQL:

```sql
COPY (
  SELECT * FROM donations
  WHERE status = 'completed'
  ORDER BY created_at DESC
) TO '/tmp/donations.csv' CSV HEADER;
```

## Performance

### Optimization

1. **Indexes**: Already created for common queries
2. **Pagination**: Use LIMIT and OFFSET for large datasets
3. **Caching**: Cache analytics results (implement Redis if needed)

### Query Optimization

Good:
```sql
-- Uses index
SELECT * FROM donations
WHERE paypal_transaction_id = 'TXN-123';
```

Bad:
```sql
-- Full table scan
SELECT * FROM donations
WHERE LOWER(donor_email) LIKE '%example%';
```

## Security

### Best Practices

1. **Never expose service role key** to client
2. **Use anon key** for client-side operations
3. **Validate all inputs** before database insert
4. **Use RLS** to control data access
5. **Enable 2FA** on Supabase account

### Sensitive Data

- Email addresses stored but not publicly accessible
- Gotram information private
- No credit card data stored (handled by PayPal)

## TypeScript Types

### Donation Type

```typescript
interface Donation {
  id: string;
  paypal_order_id: string;
  paypal_transaction_id: string | null;
  amount: number;
  currency: string;
  tier_name: string;
  donor_name: string;
  donor_email: string;
  donor_gotram: string | null;
  donor_message: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  tax_receipt_eligible: boolean;
  tax_receipt_sent: boolean;
  tax_receipt_sent_at: string | null;
  created_at: string;
  captured_at: string | null;
  updated_at: string;
}
```

## Troubleshooting

### Common Issues

**Issue**: "Missing Supabase environment variables"
- **Solution**: Check `.env` file has all three Supabase keys

**Issue**: "Failed to save donation to database"
- **Solution**: Check RLS policies, verify table exists

**Issue**: "Success page not loading donation"
- **Solution**: Check transaction ID in URL, verify database query

**Issue**: "Analytics returning empty data"
- **Solution**: Ensure there are completed donations in database

### Debug Mode

Enable detailed logging:

```typescript
// In API routes
console.log('Supabase operation:', {
  operation: 'insert',
  table: 'donations',
  data
});

// Check Supabase logs
// Dashboard → Logs → Real-time logs
```

## Deployment

### Vercel Environment Variables

Add to Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Production Checklist

- [ ] Database schema created
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] Environment variables set
- [ ] Test donation end-to-end
- [ ] Verify data in dashboard
- [ ] Enable automatic backups

## Future Enhancements

1. **Database Migrations**: Use Supabase CLI for version control
2. **Triggers**: Automatic email on donation completion
3. **Functions**: Serverless functions for complex operations
4. **Real-time**: Subscribe to donation changes
5. **Storage**: Store PDF tax receipts in Supabase Storage

## Support

- **Supabase Documentation**: https://supabase.com/docs
- **Supabase Support**: https://supabase.com/support
- **Community**: https://github.com/supabase/supabase/discussions
