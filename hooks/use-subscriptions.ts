"use client";

import { useState, useEffect } from "react";
import { 
  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from "@/lib/api/subscriptions";
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

  async function refresh(): Promise<void> {
    try {
      setIsLoading(true);
      const data = await fetchSubscriptions();
      setSubscriptions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    } finally {
      setIsLoading(false);
    }
  }

  async function addSubscription(newSubscription: NewSubscription): Promise<Subscription> {
    try {
      const subscription = await createSubscription(newSubscription);
      await refresh();
      return subscription;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to add subscription');
    }
  }

  async function handleUpdateSubscription(updatedSubscription: SubscriptionUpdate): Promise<Subscription> {
    try {
      const subscription = await updateSubscription(updatedSubscription);
      await refresh();
      return subscription;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update subscription');
    }
  }

  async function handleDeleteSubscription(id: string): Promise<void> {
    try {
      await deleteSubscription(id);
      await refresh();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete subscription');
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return {
    data: subscriptions,
    isLoading,
    error,
    refresh,
    addSubscription,
    updateSubscription: handleUpdateSubscription,
    deleteSubscription: handleDeleteSubscription,
  };
}
