"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import { Client, NewClient, ClientUpdate } from "@/types/client";

const fetcher = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);
  return data || []; // Return empty array instead of undefined
};

interface UseClientsReturn {
  data: Client[] | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  addClient: (client: NewClient) => Promise<Client>;
  updateClient: (client: ClientUpdate) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
}

export function useClients(): UseClientsReturn {
  const { data, error, isLoading, mutate } = useSWR<Client[]>('clients', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 5000,
    fallbackData: null // Explicitly set fallback to null
  });

  async function addClient(newClient: NewClient): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('No data returned from insert');

      await mutate();
      return data as Client;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to add client');
    }
  }

  async function updateClient(updatedClient: ClientUpdate): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updatedClient)
        .eq('id', updatedClient.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('No data returned from update');

      await mutate();
      return data as Client;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update client');
    }
  }

  async function deleteClient(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      await mutate();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete client');
    }
  }

  return {
    data: data || null, // Ensure we always return null instead of undefined
    isLoading,
    error: error as Error | null,
    refresh: () => mutate(),
    addClient,
    updateClient,
    deleteClient,
  };
}