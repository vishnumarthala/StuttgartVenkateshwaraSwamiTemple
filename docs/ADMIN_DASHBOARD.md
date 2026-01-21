# Admin Dashboard Setup Guide

This guide explains how to set up and configure the admin dashboard for tracking donations and issuing Spendenbescheinigungen (German tax receipts).

## Overview

The admin dashboard provides:
- **Dashboard Home**: Overview of total donations, funds raised, and pending tax receipts
- **Donations List**: Filterable/searchable table of all donations with CSV export
- **Donation Details**: Full donor information, payment details, and admin notes
- **Tax Receipts Management**: Generate and track Spendenbescheinigungen for eligible donations (€300+)

## Setup Steps

### 1. Run Database Migration

Execute the migration to add address fields and admin user table:

```bash
# Connect to Supabase and run the migration
# In Supabase Dashboard > SQL Editor, run:
```

Copy and paste the contents of `migrations/002_add_donor_address_fields.sql`

This migration adds:
- `donor_street`, `donor_postal_code`, `donor_city`, `donor_country` columns
- `tax_receipt_document_url` and `admin_notes` columns
- `admin_users` table for role management
- Updated RLS policies for authenticated admin access

### 2. Enable Supabase Authentication

1. Go to **Supabase Dashboard > Authentication > Settings**
2. Ensure email authentication is enabled
3. Configure email templates as needed

### 3. Create Admin User

1. Go to **Supabase Dashboard > Authentication > Users**
2. Click **Add User** and create an account with email/password
3. Copy the user's UUID from the user list
4. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_users (user_id, email, role)
VALUES (
  'YOUR-USER-UUID-HERE',
  'admin@example.com',
  'admin'
);
```

### 4. Environment Variables

Ensure these environment variables are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Accessing the Admin Dashboard

1. Navigate to `/admin/login`
2. Sign in with your admin credentials
3. You'll be redirected to the dashboard

## Features

### Dashboard (`/admin`)
- Total funds raised
- Completed/pending donation counts
- Average donation amount
- Tax receipts pending count
- Recent donations list

### Donations List (`/admin/donations`)
- View all donations with pagination
- Filter by status (completed, pending, failed, refunded)
- Filter by tax receipt status (eligible, sent, pending)
- Search by donor name, email, or transaction ID
- Export to CSV

### Donation Details (`/admin/donations/[id]`)
- Full donor information
- Address for tax receipt
- Payment/transaction details
- Add/edit admin notes
- Quick actions (email donor, generate receipt)

### Tax Receipts (`/admin/tax-receipts`)
- View all eligible donations (€300+)
- Preview Spendenbescheinigung before sending
- Download HTML receipt (can be printed to PDF)
- Mark receipts as sent
- Track sent receipts history

## Spendenbescheinigung Requirements

German tax receipts (Zuwendungsbestätigung) require:

| Field | Source | Required |
|-------|--------|----------|
| Donor Name | `donor_name` | ✅ |
| Donor Address | `donor_street`, `donor_postal_code`, `donor_city`, `donor_country` | ✅ |
| Donation Amount | `amount` | ✅ |
| Donation Date | `captured_at` or `created_at` | ✅ |
| Organization Details | `site-config.json` | ✅ |

**Note**: Address fields are only collected for donations of €300 or more.

## File Structure

```
app/
  admin/
    layout.tsx          # Protected admin layout with sidebar
    page.tsx            # Dashboard home
    login/
      page.tsx          # Login page
    donations/
      page.tsx          # Donations list
      [id]/
        page.tsx        # Donation detail
    tax-receipts/
      page.tsx          # Tax receipts management
  api/
    admin/
      tax-receipt/
        route.ts        # API for generating/managing tax receipts

lib/
  supabase.ts           # Supabase client with auth helpers
  admin-auth.tsx        # Admin auth context and hooks
  spendenbescheinigung.ts # Tax receipt HTML generator

migrations/
  002_add_donor_address_fields.sql  # Database migration
```

## Security

- Admin routes are protected by Supabase Auth
- Only users in the `admin_users` table can access the dashboard
- RLS policies restrict data access to authenticated admins
- The analytics API should be updated to require admin authentication in production

## Troubleshooting

### "You do not have admin access"
- Verify the user exists in `admin_users` table
- Check that `user_id` matches the auth user's UUID

### Tax receipt generation fails
- Ensure donor has complete address (street, city required)
- Verify donation is eligible (€300+)
- Check browser console for API errors

### Session issues
- Clear browser cookies and re-login
- Check Supabase auth settings
