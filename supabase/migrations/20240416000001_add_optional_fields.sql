-- Add website and logo columns to subscriptions
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add foreign key relationships for client and user
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id),
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);