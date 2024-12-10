-- Add removal-related columns to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS flagged_for_removal BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS removal_date TIMESTAMP WITH TIME ZONE;