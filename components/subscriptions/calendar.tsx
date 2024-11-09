"use client";

import { Card } from "@/components/ui/card";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, startOfWeek, endOfWeek } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn, calculateNextBillingDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubscriptionCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: subscriptions } = useSubscriptions();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const subscriptionsByDate = subscriptions?.reduce((acc, sub) => {
    const nextBillingDate = calculateNextBillingDate(sub.next_billing_date, sub.frequency);
    const date = format(nextBillingDate, 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(sub);
    return acc;
  }, {} as Record<string, typeof subscriptions>);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center font-medium bg-secondary text-secondary-foreground">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const daySubscriptions = subscriptionsByDate?.[dateKey] || [];
          const isCurrentMonth = format(day, 'M') === format(currentMonth, 'M');
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] p-2 bg-card",
                "transition-colors",
                !isCurrentMonth && "opacity-50 bg-muted",
              )}
            >
              <div className={cn(
                "font-medium text-sm mb-1",
                format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && 
                "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mx-auto"
              )}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {daySubscriptions.map(sub => (
                  <Badge
                    key={sub.id}
                    variant={sub.flagged_for_removal ? "destructive" : "secondary"}
                    className="block truncate text-xs w-full text-center"
                  >
                    {sub.name}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}