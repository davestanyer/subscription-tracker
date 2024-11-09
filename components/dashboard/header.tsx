"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { formatCurrency, calculateNextBillingDate } from "@/lib/utils";
import { AddSubscriptionDialog } from "@/components/subscriptions/add-subscription-dialog";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ExchangeRate {
  currency_code: string;
  rate_date: string;
  exchange_rate: number;
}

export function DashboardHeader() {
  const { data: subscriptions, refresh } = useSubscriptions();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  
  useEffect(() => {
    async function fetchExchangeRates() {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('rate_date', { ascending: false });

      if (error) {
        console.error('Error fetching exchange rates:', error);
        return;
      }

      setExchangeRates(data);
    }

    fetchExchangeRates();
  }, []);

  const getExchangeRate = (currency: string, date: string) => {
    if (currency === 'NZD') return 1;
    
    const rates = exchangeRates.filter(rate => rate.currency_code === currency);
    if (!rates.length) return null;

    // Find the rate closest to but not after the given date
    const closestRate = rates.find(rate => rate.rate_date <= date);
    return closestRate?.exchange_rate || rates[0].exchange_rate;
  };

  // Calculate total monthly cost in NZD
  const totalMonthly = subscriptions?.reduce((acc, sub) => {
    if (sub.flagged_for_removal) return acc;
    
    const exchangeRate = getExchangeRate(sub.currency, sub.next_billing_date) || 1;
    const amountInNZD = sub.amount * exchangeRate;
    
    return acc + (sub.frequency === "monthly" ? amountInNZD : 
           sub.frequency === "quarterly" ? amountInNZD / 3 : 
           amountInNZD / 12);
  }, 0) || 0;

  // Find the next upcoming billing date
  const nextBillingDate = subscriptions?.reduce((closest, sub) => {
    if (sub.flagged_for_removal) return closest;
    const nextDate = calculateNextBillingDate(sub.next_billing_date, sub.frequency);
    if (!closest || nextDate < closest) {
      return nextDate;
    }
    return closest;
  }, null as Date | null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <AddSubscriptionDialog onSubscriptionAdded={refresh} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(totalMonthly, 'NZD')}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              <p className="text-2xl font-bold">
                {subscriptions?.filter(sub => !sub.flagged_for_removal).length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Payment</p>
              <p className="text-2xl font-bold">
                {nextBillingDate ? format(nextBillingDate, 'MMM d') : '-'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}