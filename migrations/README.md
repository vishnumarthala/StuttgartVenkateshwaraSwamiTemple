# Database Migrations

This folder contains SQL migration scripts for the Supabase database.

## Migration Files

- **001_create_donations_table.sql** - Creates the main donations table with indexes, triggers, and RLS policies

## How to Run Migrations

### Using Supabase Dashboard

1. Go to your Supabase project: https://ribsurazlqpnefgqlded.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click "New query"
4. Copy the contents of the migration file (e.g., `001_create_donations_table.sql`)
5. Paste into the SQL Editor
6. Click "Run" or press `Ctrl+Enter`
7. Verify success message appears

### Using Supabase CLI (Optional)

If you have the Supabase CLI installed:

```bash
supabase db push
```

## Migration History

| Migration | Date | Description | Status |
|-----------|------|-------------|--------|
| 001 | 2025-01-18 | Create donations table | ✅ Ready |

## Rollback

If you need to rollback a migration, run the corresponding rollback script.

### Rollback 001 - Drop donations table

```sql
-- WARNING: This will delete all donation data!

-- Drop view
DROP VIEW IF EXISTS donation_analytics;

-- Drop policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON donations;
DROP POLICY IF EXISTS "Allow anonymous updates" ON donations;
DROP POLICY IF EXISTS "Allow anonymous reads" ON donations;

-- Drop trigger
DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop table
DROP TABLE IF EXISTS donations;
```

## Best Practices

1. **Never modify existing migrations** - Create a new migration instead
2. **Always test migrations** in development before running in production
3. **Backup your database** before running migrations in production
4. **Use transactions** where possible to allow rollback on errors
5. **Version control** - Always commit migrations to git

## Creating New Migrations

When creating a new migration:

1. Create a new file with naming pattern: `00X_description.sql`
2. Include header comment with:
   - Migration number
   - Description
   - Author
   - Date
3. Use `CREATE IF NOT EXISTS` and `DROP IF EXISTS` to make migrations idempotent
4. Test the migration in a development environment first
5. Document the migration in this README

## Example Migration Template

```sql
-- Migration: 00X_migration_name
-- Description: What this migration does
-- Author: Your Name
-- Date: YYYY-MM-DD

-- Your SQL here

-- Verification
DO $$
BEGIN
  -- Verify changes
  RAISE NOTICE 'Migration 00X completed successfully';
END $$;
```

## Troubleshooting

### "relation already exists"

The migration has already been run. Check if the table exists:

```sql
SELECT * FROM information_schema.tables WHERE table_name = 'donations';
```

### "permission denied"

Check your RLS policies:

```sql
SELECT * FROM pg_policies WHERE tablename = 'donations';
```

### "syntax error"

Review the SQL syntax. Common issues:
- Missing semicolons
- Incorrect quote types (use single quotes for strings)
- PostgreSQL-specific functions not supported

## Support

For migration issues:
- Check Supabase logs in Dashboard → Logs
- Review PostgreSQL error messages
- Consult [Supabase Documentation](https://supabase.com/docs)
