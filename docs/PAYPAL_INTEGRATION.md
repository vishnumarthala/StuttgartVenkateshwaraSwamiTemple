# PayPal Donation Integration Documentation

## Overview

The temple website uses PayPal SDK for processing donations. This integration replaces simple PayPal.me links with a full-featured checkout flow that includes donor information collection, payment processing, and confirmation.

## Features

- ✅ 5-tier donation system (€116 to €10,000+)
- ✅ Integrated PayPal checkout with modal form
- ✅ Donor information collection (name, email, gotram, message)
- ✅ Tier-aware validation (Gotram required for Tier 2+)
- ✅ Tax receipt eligibility tracking (€300+)
- ✅ Server-side payment processing
- ✅ Database storage for donation tracking
- ✅ Success page with transaction details

## Architecture

### Components

1. **Donation Form** (`components/donation/DonationForm.tsx`)
   - Collects donor information before payment
   - Validates required fields based on tier
   - Shows tier benefits and eligibility notices
   - Renders PayPal button after validation

2. **PayPal Button** (`components/donation/PayPalButton.tsx`)
   - Integrated PayPal SDK button
   - Handles order creation and approval
   - Manages loading and error states
   - Redirects to success page

3. **Tier Card** (`components/donation/TierCard.tsx`)
   - Displays donation tier information
   - Opens modal form on PayPal button click
   - Shows benefits and highlights popular tier

4. **Success Page** (`app/donate/success/page.tsx`)
   - Queries donation from database
   - Shows personalized thank you message
   - Displays transaction details
   - Provides next steps information

### API Routes

1. **Create Order** (`app/api/paypal/create-order/route.ts`)
   - Validates donor information
   - Creates PayPal order
   - Inserts pending donation to database
   - Returns order ID

2. **Capture Order** (`app/api/paypal/capture-order/route.ts`)
   - Captures PayPal payment
   - Updates donation status to completed
   - Returns transaction ID

3. **Analytics** (`app/api/analytics/route.ts`)
   - Returns donation statistics
   - Aggregates by tier
   - Shows recent donations

## Configuration

### Environment Variables

Required variables in `.env`:

```env
# PayPal Configuration
# Public (browser) - safe to expose
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_PAYPAL_MODE=live  # or 'sandbox' for testing

# Private (server only) - never expose
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_MODE=live  # or 'sandbox' for testing
```

### PayPal Credentials

1. **Client ID**: Public key for SDK initialization (client-side)
2. **Client Secret**: Private key for API authentication (server-side only)
3. **Mode**:
   - `sandbox` - Test environment (use test credentials)
   - `live` - Production environment (real payments)

Important:
- Do not store the client secret in Supabase tables or anywhere client-accessible.
- In production, store secrets in your hosting provider's environment variables (e.g. Vercel Project Settings → Environment Variables).

### Getting PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create or select an app
3. Copy Client ID and Secret from app details
4. Add to `.env` file

## Payment Flow

### 1. User Selects Tier

```
User visits /donate → Views 5 tiers → Clicks "Pay with PayPal"
```

### 2. Donation Form Opens

```
Modal opens with:
- Pre-filled amount from tier
- Name field (required)
- Email field (required)
- Gotram field (required for Tier 2+)
- Message field (optional)
- Tax receipt notice (if €300+)
```

### 3. Form Validation

```typescript
// Validation rules
name: required, non-empty
email: required, valid format
gotram: required if tier.minAmount >= 201
amount: must be > 0
```

### 4. PayPal Button Click

```
1. Frontend calls POST /api/paypal/create-order
2. Server validates data
3. Server calls PayPal API to create order
4. Server saves pending donation to database
5. Server returns orderId
6. PayPal popup opens for user
```

### 5. User Completes Payment

```
1. User logs into PayPal
2. User approves payment
3. Frontend calls POST /api/paypal/capture-order
4. Server captures payment
5. Server updates donation status to completed
6. Redirect to /donate/success with transaction ID
```

### 6. Success Page

```
1. Query donation from database by transaction ID
2. Display personalized thank you with donor name
3. Show transaction details
4. Provide next steps (email, tax receipt, services)
```

## Data Model

### Donor Information

```typescript
interface DonorInfo {
  name: string;          // Required
  email: string;         // Required, validated
  gotram?: string;       // Required for Tier 2+
  message?: string;      // Optional
}
```

### Tier Configuration

```typescript
interface DonationTier {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number | null;
  benefits: string[];
  highlighted?: boolean;
}
```

Tiers are defined in `content/tiers.json`.

## Error Handling

### Client-Side Errors

- **Form validation errors**: Displayed inline with red text
- **Payment cancelled**: Alert message, user can retry
- **Payment failed**: Alert message with error details
- **Network errors**: Generic error message

### Server-Side Errors

- **Invalid data**: 400 Bad Request with error message
- **PayPal API errors**: 500 Internal Server Error
- **Database errors**: Logged but don't fail payment

### Error Recovery

1. **Payment succeeds, DB insert fails**:
   - Payment proceeds normally
   - Error logged to console
   - Manual reconciliation from PayPal dashboard

2. **Payment succeeds, DB update fails**:
   - Money received in PayPal account
   - Status stays "pending" in database
   - Update manually or via reconciliation script

## Testing

### Sandbox Testing

1. Switch to sandbox mode:
   ```env
   NEXT_PUBLIC_PAYPAL_MODE=sandbox
   PAYPAL_MODE=sandbox
   ```

2. Use sandbox credentials from PayPal Developer Dashboard

3. Test with PayPal sandbox accounts:
   - Personal account (buyer)
   - Business account (merchant)

4. Test scenarios:
   - Successful payment
   - Cancelled payment
   - Declined payment
   - Network timeout

### Production Testing

1. Use small amount (€1) for testing
2. Verify in PayPal dashboard
3. Check database for correct data
4. Test all tier levels
5. Verify email format validation
6. Test Gotram requirement (Tier 2+)

## Security

### Best Practices

1. **Client Secret**: Never exposed to browser (server-side only)
2. **Input Validation**: All fields validated on server
3. **Amount Verification**: Server checks amount matches tier
4. **HTTPS Required**: PayPal requires SSL in production
5. **Error Messages**: Don't expose sensitive details to client

### Security Features

- Server-side order creation (can't manipulate amount)
- Email format validation
- SQL injection protection (Supabase parameterized queries)
- Row Level Security on database

## Troubleshooting

### Common Issues

**Issue**: "Missing Supabase environment variables"
- **Solution**: Ensure `.env` has Supabase URL and anon key

**Issue**: "Failed to create PayPal order"
- **Solution**: Check PayPal credentials, check API mode (sandbox/live)

**Issue**: "Gotram validation failing"
- **Solution**: Verify tier minAmount >= 201 for Gotram requirement

**Issue**: PayPal button not showing
- **Solution**: Check browser console, verify Client ID is loaded

**Issue**: Success page shows "Loading..." forever
- **Solution**: Check database query, verify transaction ID is correct

### Debug Mode

Enable detailed logging:

```typescript
// In create-order API
console.log('Creating order:', { amount, tierName, donorInfo });

// In capture-order API
console.log('Capturing order:', { orderId, result });
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `NEXT_PUBLIC_PAYPAL_MODE`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Environment-Specific Settings

**Development**:
```env
NEXT_PUBLIC_PAYPAL_MODE=sandbox
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production**:
```env
NEXT_PUBLIC_PAYPAL_MODE=live
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Maintenance

### Regular Tasks

1. **Check PayPal Dashboard**: Monitor transactions
2. **Review Database**: Verify all payments recorded
3. **Reconciliation**: Match PayPal transactions to database records
4. **Error Logs**: Review console logs for failures

### Updating Tiers

Edit `content/tiers.json`:

```json
{
  "id": "tier-1",
  "name": "Tier 1",
  "minAmount": 116,
  "maxAmount": 200,
  "benefits": [
    "Kumkum Prasadam from Kumbhabhishekam"
  ]
}
```

## Future Enhancements

Potential features to add:

1. **Email Notifications**:
   - Send confirmation email to donor
   - Notify admin of new donations
   - Automated tax receipt emails

2. **Webhooks**:
   - Real-time payment notifications
   - Automatic status updates
   - Refund handling

3. **Admin Dashboard**:
   - View all donations
   - Filter and search
   - Export to CSV
   - Mark tax receipts as sent

4. **Recurring Donations**:
   - Monthly/yearly subscriptions
   - PayPal billing agreements

5. **Multi-Currency**:
   - Support USD, GBP, etc.
   - Automatic conversion

## Support

For issues or questions:

- **PayPal Documentation**: https://developer.paypal.com/docs/
- **PayPal Support**: https://www.paypal.com/merchantsupport
- **Supabase Documentation**: https://supabase.com/docs

## License

This integration is part of the Sri Venkateshwara Temple Stuttgart website.
