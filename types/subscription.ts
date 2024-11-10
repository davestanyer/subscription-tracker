export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: 'USD' | 'NZD' | 'AUD' | 'EUR';
  frequency: 'monthly' | 'quarterly' | 'annually';
  next_billing_date: string;
  status: 'active' | 'cancelled' | 'pending';
  website_url?: string;
  logo_url?: string;
  client_id?: string;
  user_id?: string;
  flagged_for_removal?: boolean;
  removal_date?: string | null;
}
