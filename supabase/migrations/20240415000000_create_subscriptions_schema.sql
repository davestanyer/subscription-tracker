-- Create enum types
CREATE TYPE subscription_frequency AS ENUM ('monthly', 'quarterly', 'annually');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'pending');

-- Create clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    frequency subscription_frequency NOT NULL,
    next_billing_date DATE NOT NULL,
    billing_email VARCHAR(255) NOT NULL,
    status subscription_status NOT NULL DEFAULT 'active',
    client_id UUID REFERENCES clients(id),
    owner_id UUID NOT NULL REFERENCES users(id),
    local_amount DECIMAL(10,2),
    local_currency VARCHAR(3),
    exchange_rate DECIMAL(10,4),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_owner_id ON subscriptions(owner_id);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust according to your needs)
CREATE POLICY "Users can view their own data"
    ON subscriptions FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own data"
    ON subscriptions FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own data"
    ON subscriptions FOR UPDATE
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete their own data"
    ON subscriptions FOR DELETE
    USING (owner_id = auth.uid());