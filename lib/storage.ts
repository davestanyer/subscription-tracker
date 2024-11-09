"use client";

import { supabase } from './supabase';
import type { Database } from '@/types/supabase';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export async function getStoredSubscriptions(): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_billing_date');

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }

  return data;
}

export async function setStoredSubscriptions(subscriptions: Subscription[]) {
  // This function is kept for backwards compatibility but is no longer used
  console.warn('setStoredSubscriptions is deprecated. Use Supabase operations directly.');
}