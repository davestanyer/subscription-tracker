export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  next_billing_date: string;
  status: 'active' | 'cancelled' | 'pending';
  flagged_for_removal?: boolean;
  removal_date?: string | null;
}