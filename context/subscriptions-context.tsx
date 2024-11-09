"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  next_billing_date: string;
  website_url?: string;
  logo_url?: string;
  client_id?: string;
  user_id?: string;
  flagged_for_removal?: boolean;
  removal_date?: string;
}

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => Promise<void>;
  updateSubscription: (subscription: Subscription) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('name');

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([subscription]);

      if (error) throw error;
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add subscription'));
      throw err;
    }
  };

  const updateSubscription = async (subscription: Subscription) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update(subscription)
        .eq('id', subscription.id);

      if (error) throw error;
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update subscription'));
      throw err;
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete subscription'));
      throw err;
    }
  };

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        isLoading,
        error,
        refresh,
        addSubscription,
        updateSubscription,
        deleteSubscription,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionsProvider');
  }
  return context;
}