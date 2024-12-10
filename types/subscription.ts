export type Currency = 'USD' | 'NZD' | 'AUD' | 'EUR';
export type SubscriptionFrequency = 'monthly' | 'quarterly' | 'annually';
export type SubscriptionStatus = 'active' | 'cancelled' | 'pending';

interface Client {
  id: string;
  name: string;
}

interface Owner {
  id: string;
  name: string;
  email: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  frequency: SubscriptionFrequency;
  next_billing_date: string;
  billing_email: string;
  status: SubscriptionStatus;
  website_url?: string;
  logo_url?: string;
  client_id?: string;
  client?: Client;
  user_id?: string;
  owner?: Owner;
  flagged_for_removal?: boolean;
  removal_date?: string | null;
  created_at: string;
  updated_at: string;
}

export type NewSubscription = Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'client' | 'owner'>;
export type SubscriptionUpdate = Partial<Subscription> & Pick<Subscription, 'id'>;
