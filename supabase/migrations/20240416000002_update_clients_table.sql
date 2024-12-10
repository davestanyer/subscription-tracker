-- Add status column to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- Update RLS policies for clients table
DROP POLICY IF EXISTS "Enable read access for all users" ON clients;
DROP POLICY IF EXISTS "Enable insert access for all users" ON clients;
DROP POLICY IF EXISTS "Enable update access for all users" ON clients;
DROP POLICY IF EXISTS "Enable delete access for all users" ON clients;

CREATE POLICY "Enable read access for all users"
ON clients FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable insert access for all users"
ON clients FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON clients FOR UPDATE
TO anon
USING (true);

CREATE POLICY "Enable delete access for all users"
ON clients FOR DELETE
TO anon
USING (true);