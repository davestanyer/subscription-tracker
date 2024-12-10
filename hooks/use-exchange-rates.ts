"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase";

export interface ExchangeRate {
  id: number;
  currency_code: string;
  rate_date: string;
  exchange_rate: number;
  created_at: string;
  updated_at: string;
}

const fetcher = async () => {
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('rate_date', { ascending: false });

    if (error) throw error;
    return data as ExchangeRate[];
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return [];
  }
};

export function useExchangeRates() {
  const { data, error, isLoading, mutate } = useSWR<ExchangeRate[]>(
    'exchange_rates',
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 3600000, // Refresh every hour
    }
  );

  const getExchangeRate = (currency: string, date: string): number => {
    if (!data || currency === 'NZD') return 1;
    
    const rates = data.filter(rate => rate.currency_code === currency);
    if (!rates.length) return 1;

    const closestRate = rates.find(rate => rate.rate_date <= date);
    return closestRate?.exchange_rate || rates[0].exchange_rate;
  };

  return {
    data: data || [],
    isLoading,
    error,
    refresh: () => mutate(),
    getExchangeRate,
  };
}