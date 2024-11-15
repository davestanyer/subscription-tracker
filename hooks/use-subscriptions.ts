"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Subscription, NewSubscription, SubscriptionUpdate } from "@/types/subscription";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          client:clients(id, name),
          owner:users(id, name, email)
        `)
        .order('next_billing_date');

      if (error) throw error;
      setSubscriptions(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to fetch subscriptions');
    } finally {
      setIsLoading(false);
    }
  }

  async function addSubscription(newSubscription: NewSubscription) {
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

      if (error) throw error;
      setSubscriptions(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }
  }

  async function updateSubscription(updatedSubscription: SubscriptionUpdate) {
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

      if (error) throw error;
      setSubscriptions(prev =>
        prev.map(subscription => (subscription.id === data.id ? data : subscription))
      );
      return data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  async function deleteSubscription(id: string) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubscriptions(prev => prev.filter(subscription => subscription.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  }

  return {
    data: subscriptions,
    isLoading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refresh: fetchSubscriptions,
  };
}
