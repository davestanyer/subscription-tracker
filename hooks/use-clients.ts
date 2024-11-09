"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Client = Database['public']['Tables']['clients']['Row'];

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;
      setClients(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to fetch clients');
    } finally {
      setIsLoading(false);
    }
  }

  async function addClient(newClient: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single();

      if (error) throw error;
      setClients(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  }

  async function updateClient(updatedClient: Client) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updatedClient)
        .eq('id', updatedClient.id)
        .select()
        .single();

      if (error) throw error;
      setClients(prev =>
        prev.map(client => (client.id === data.id ? data : client))
      );
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  async function deleteClient(id: string) {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  return {
    data: clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refresh: fetchClients,
  };
}