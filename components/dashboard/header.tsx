"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { formatCurrency, calculateNextBillingDate } from "@/lib/utils";
import { AddSubscriptionDialog } from "@/components/subscriptions/add-subscription-dialog";
import { format } from "date-fns";
import { useExchangeRates } from "@/hooks/use-exchange-rates";

export function DashboardHeader() {
  const { data: subscriptions } = useSubscriptions();
  const { getExchangeRate } = useExchangeRates();
  
  const totalMonthly = subscriptions?.reduce((acc, sub) => {
    if (sub.flagged_for_removal) return acc;
    
    const exchangeRate = getExchangeRate(sub.currency, sub.next_billing_date);
    const amountInNZD = sub.amount * exchangeRate;
    
    return acc + (sub.frequency === "monthly" ? amountInNZD : 
           sub.frequency === "quarterly" ? amountInNZD / 3 : 
           amountInNZD / 12);
  }, 0) || 0;

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
        <AddSubscriptionDialog />
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