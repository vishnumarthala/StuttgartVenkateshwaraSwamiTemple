# Documentation Index

Welcome to the Sri Venkateshwara Temple Stuttgart documentation. This folder contains comprehensive guides for the donation system and its integrations.

## Quick Links

- **[PayPal Integration](./PAYPAL_INTEGRATION.md)** - Complete guide to PayPal donation processing
- **[Supabase Integration](./SUPABASE_INTEGRATION.md)** - Database setup and usage
- **[Database Setup](./DATABASE_SETUP.md)** - Step-by-step database configuration

## Overview

The temple website features a complete donation system with:

- **5 Donation Tiers**: From €116 to €10,000+
- **PayPal Integration**: Secure payment processing
- **Database Storage**: Supabase PostgreSQL for permanent records
- **Analytics**: Track donations and generate reports
- **Tax Receipts**: Automatic eligibility tracking for €300+

## Getting Started

### For Developers

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/temple-website.git
   cd temple-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add PayPal credentials (see [PayPal Integration](./PAYPAL_INTEGRATION.md))
   - Add Supabase credentials (see [Database Setup](./DATABASE_SETUP.md))

4. **Set Up Database**
   - Follow [Database Setup Guide](./DATABASE_SETUP.md)
   - Run SQL schema in Supabase Dashboard

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Test Donation Flow**
   - Visit http://localhost:3000/donate
   - Test with small amount
   - Verify in PayPal and Supabase dashboards

### For Administrators

1. **View Donations**
   - Login to [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to Table Editor → donations
   - View, filter, and export data

2. **Check Analytics**
   - Visit `/api/analytics` endpoint
   - Or run SQL queries in Supabase (see [Supabase Integration](./SUPABASE_INTEGRATION.md))

3. **Tax Receipts**
   - Query donations with `tax_receipt_eligible = true`
   - Export donor emails and amounts
   - Mark as sent after processing

## Architecture

### Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Payment**: PayPal SDK (@paypal/react-paypal-js)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (recommended)

### Key Components

```
├── app/
│   ├── api/
│   │   ├── paypal/
│   │   │   ├── create-order/    # Creates PayPal order
│   │   │   └── capture-order/   # Captures payment
│   │   └── analytics/           # Donation statistics
│   ├── donate/
│   │   ├── page.tsx            # Main donation page
│   │   └── success/            # Success confirmation
│   └── layout.tsx              # PayPal provider wrapper
├── components/
│   ├── donation/
│   │   ├── DonationForm.tsx    # Donor info form
│   │   ├── PayPalButton.tsx    # PayPal checkout button
│   │   ├── TierCard.tsx        # Tier display card
│   │   └── TierGrid.tsx        # Tier grid layout
│   └── PayPalProvider.tsx      # PayPal SDK provider
├── lib/
│   ├── paypal.ts               # PayPal API functions
│   ├── supabase.ts             # Supabase client
│   └── types.ts                # TypeScript types
└── content/
    └── tiers.json              # Donation tier definitions
```

## Payment Flow

1. **User Selects Tier** → Clicks "Pay with PayPal"
2. **Donation Form Opens** → Collects name, email, gotram, message
3. **Form Validation** → Checks required fields
4. **Create Order** → API creates PayPal order + DB record (pending)
5. **PayPal Popup** → User logs in and approves payment
6. **Capture Payment** → API captures payment + updates DB (completed)
7. **Success Page** → Shows personalized thank you with transaction details

## Data Model

### Donations Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| paypal_order_id | TEXT | PayPal order ID (unique) |
| paypal_transaction_id | TEXT | PayPal transaction ID (unique) |
| amount | DECIMAL | Donation amount |
| currency | TEXT | Currency code (EUR) |
| tier_name | TEXT | Selected tier |
| donor_name | TEXT | Donor's full name |
| donor_email | TEXT | Donor's email |
| donor_gotram | TEXT | Gotram (optional) |
| donor_message | TEXT | Message (optional) |
| status | TEXT | pending/completed/failed/refunded |
| tax_receipt_eligible | BOOLEAN | True if amount >= €300 |
| tax_receipt_sent | BOOLEAN | Tax receipt sent flag |
| created_at | TIMESTAMP | Order creation time |
| captured_at | TIMESTAMP | Payment capture time |

## Configuration

### Environment Variables

```env
# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_PAYPAL_MODE=live

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Donation Tiers

Edit `content/tiers.json`:

```json
{
  "id": "tier-1",
  "name": "Tier 1",
  "minAmount": 116,
  "maxAmount": 200,
  "benefits": [
    "Kumkum Prasadam from Kumbhabhishekam"
  ],
  "highlighted": false
}
```

## Security

### Best Practices

- ✅ Client Secret stays server-side only
- ✅ Input validation on all fields
- ✅ Row Level Security (RLS) on database
- ✅ HTTPS required in production
- ✅ Error messages don't expose sensitive data

### Payment Security

- All payments processed by PayPal (PCI DSS compliant)
- No credit card data stored on our servers
- PayPal handles fraud detection
- Secure redirect flow

## Testing

### Sandbox Testing

1. Use PayPal sandbox credentials
2. Set `NEXT_PUBLIC_PAYPAL_MODE=sandbox`
3. Create test buyer and seller accounts
4. Test all payment scenarios

### Production Testing

1. Use live PayPal credentials
2. Set `NEXT_PUBLIC_PAYPAL_MODE=live`
3. Test with small amount (€1)
4. Verify in PayPal dashboard
5. Check database records

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Environment-Specific Settings

**Development**:
```env
NEXT_PUBLIC_PAYPAL_MODE=sandbox
```

**Production**:
```env
NEXT_PUBLIC_PAYPAL_MODE=live
```

## Monitoring

### PayPal Dashboard

- Monitor transactions
- View payment status
- Handle refunds
- Download reports

### Supabase Dashboard

- View donation records
- Run analytics queries
- Export data to CSV
- Monitor API usage

### Error Logging

- Check browser console (client errors)
- Check Vercel logs (server errors)
- Check Supabase logs (database errors)

## Analytics

### Available Metrics

- Total funds raised
- Number of donations
- Donations by tier
- Average donation amount
- Recent donations
- Tax receipt eligible donors
- Gotram submissions

### Custom Queries

See [Supabase Integration](./SUPABASE_INTEGRATION.md) for SQL query examples.

## Troubleshooting

### Common Issues

1. **PayPal button not showing**
   - Check Client ID is set correctly
   - Verify PayPalProvider is wrapping app
   - Check browser console for errors

2. **Database not saving**
   - Verify Supabase credentials
   - Check RLS policies
   - Review server logs

3. **Success page blank**
   - Check transaction ID in URL
   - Verify database query
   - Check Supabase connection

See individual integration docs for more troubleshooting help.

## Future Enhancements

Planned features:

1. **Email Notifications**
   - Confirmation emails to donors
   - Admin notifications
   - Tax receipt emails

2. **Admin Dashboard**
   - View all donations
   - Filter and search
   - Export reports
   - Manage tax receipts

3. **Recurring Donations**
   - Monthly/yearly subscriptions
   - PayPal billing agreements

4. **Enhanced Analytics**
   - Charts and graphs
   - Goal tracking
   - Donor retention metrics

## Support

### Documentation

- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Contact

For technical questions or issues:
- Create GitHub issue
- Email: info@svtstuttgart.de

## License

This project is part of the Sri Venkateshwara Temple Stuttgart website.

---

**Last Updated**: January 2025
**Version**: 1.0.0
