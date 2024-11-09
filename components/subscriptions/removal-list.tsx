"use client";

import { Card } from "@/components/ui/card";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { format } from "date-fns";

export function RemovalList() {
  const { data: subscriptions, updateSubscription, deleteSubscription, refresh } = useSubscriptions();

  const flaggedSubscriptions = subscriptions?.filter(
    (sub) => sub.flagged_for_removal
  ) || [];

  const handleConfirmRemoval = async (id: string) => {
    await deleteSubscription(id);
    refresh();
  };

  const handleCancelRemoval = async (subscription: any) => {
    await updateSubscription({
      ...subscription,
      flagged_for_removal: false,
      removal_date: null,
    });
    refresh();
  };

  if (flaggedSubscriptions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Pending Removals</h2>
        <p className="text-sm text-muted-foreground">
          Subscriptions flagged for removal
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Flagged Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flaggedSubscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">
                {subscription.name}
              </TableCell>
              <TableCell>{formatCurrency(subscription.amount, subscription.currency)}</TableCell>
              <TableCell>
                {subscription.removal_date
                  ? format(new Date(subscription.removal_date), "MMM d, yyyy")
                  : "Not set"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleConfirmRemoval(subscription.id)}
                    title="Confirm removal"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCancelRemoval(subscription)}
                    title="Cancel removal"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}