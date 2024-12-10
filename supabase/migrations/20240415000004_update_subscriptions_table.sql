-- Update subscriptions table to match current schema
ALTER TABLE subscriptions
  DROP COLUMN IF EXISTS billing_email,
  DROP COLUMN IF EXISTS owner_id,
  ALTER COLUMN flagged_for_removal SET DEFAULT false,
  ALTER COLUMN status SET DEFAULT 'active',
  ALTER COLUMN currency SET DEFAULT 'USD';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_flagged_for_removal ON subscriptions(flagged_for_removal);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);