"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Subscription, NewSubscription, SubscriptionUpdate } from "@/types/subscription";

interface UseSubscriptionsReturn {
  data: Subscription[] | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  addSubscription: (subscription: NewSubscription) => Promise<Subscription>;
  updateSubscription: (subscription: SubscriptionUpdate) => Promise<Subscription>;
  deleteSubscription: (id: string) => Promise<void>;
}

export function useSubscriptions(): UseSubscriptionsReturn {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchSubscriptions(): Promise<void> {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          client:clients(id, name),
          owner:users(id, name, email)
        `)
        .order('next_billing_date');

      if (error) throw new Error(error.message);
      setSubscriptions(data as Subscription[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    } finally {
      setIsLoading(false);
    }
  }

  async function addSubscription(newSubscription: NewSubscription): Promise<Subscription> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([newSubscription])
        .select(`
          *,
          client:clients(id, name),
          owner:users(id, name, email)
        `)
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('No data returned from insert');

      await fetchSubscriptions();
      return data as Subscription;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to add subscription');
    }
  }

  async function updateSubscription(updatedSubscription: SubscriptionUpdate): Promise<Subscription> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updatedSubscription)
        .eq('id', updatedSubscription.id)
        .select(`
          *,
          client:clients(id, name),
          owner:users(id, name, email)
        `)
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('No data returned from update');

      await fetchSubscriptions();
      return data as Subscription;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update subscription');
    }
  }

  async function deleteSubscription(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      await fetchSubscriptions();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete subscription');
    }
  }

  useEffect(() => {
    void fetchSubscriptions();
  }, []);

  return {
    data: subscriptions,
    isLoading,
    error,
    refresh: fetchSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
}