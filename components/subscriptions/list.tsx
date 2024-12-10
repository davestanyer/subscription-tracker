"use client";

import { useState } from "react";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditSubscriptionDialog } from "./edit-subscription-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Building2, Edit2, Flag, Search, Trash2, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Subscription } from "@/types/subscription";
import { useExchangeRates } from "@/hooks/use-exchange-rates";

interface Filters {
  service: string;
  client: string;
  owner: string;
}

export function SubscriptionList(): JSX.Element {
  const { data: subscriptions, updateSubscription, deleteSubscription } = useSubscriptions();
  const { getExchangeRate } = useExchangeRates();
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);
  const [filters, setFilters] = useState<Filters>({
    service: "",
    client: "",
    owner: ""
  });

  const handleFlagForRemoval = async (subscription: Subscription): Promise<void> => {
    const update: Subscription = {
      ...subscription,
      flagged_for_removal: true,
      removal_date: new Date().toISOString(),
    };
    await updateSubscription(update);
  };

  const handleFilterChange = (field: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }));
  };

  const filteredSubscriptions = subscriptions?.filter(subscription => {
    const matchesService = subscription.name.toLowerCase().includes(filters.service.toLowerCase());
    const matchesClient = !filters.client || 
      (subscription.client?.name?.toLowerCase().includes(filters.client.toLowerCase()) ?? false);
    const matchesOwner = !filters.owner || 
      (subscription.owner?.name?.toLowerCase().includes(filters.owner.toLowerCase()) ?? false);
    return matchesService && matchesClient && matchesOwner;
  });

  return (
    <>
      <Card className="mb-4 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by service name..."
              value={filters.service}
              onChange={handleFilterChange('service')}
              className="h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by client..."
              value={filters.client}
              onChange={handleFilterChange('client')}
              className="h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by owner..."
              value={filters.owner}
              onChange={handleFilterChange('owner')}
              className="h-9"
            />
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Amount (NZD)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions?.map((subscription) => {
              const nzdAmount = subscription.amount * getExchangeRate(subscription.currency, subscription.next_billing_date);

              return (
                <TableRow 
                  key={subscription.id}
                  className={subscription.flagged_for_removal ? "opacity-50" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={subscription.logo_url ?? undefined} alt={subscription.name} />
                        <AvatarFallback>{subscription.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{subscription.name}</div>
                        {subscription.website_url && (
                          <a 
                            href={subscription.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:underline"
                          >
                            {subscription.website_url}
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      {subscription.client && (
                        <Badge variant="outline" className="w-fit flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {subscription.client.name}
                        </Badge>
                      )}
                      {subscription.owner && (
                        <Badge variant="outline" className="w-fit flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {subscription.owner.name}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{subscription.frequency}</TableCell>
                  <TableCell>
                    {formatCurrency(subscription.amount, subscription.currency)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(nzdAmount, 'NZD')}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        subscription.flagged_for_removal ? "destructive" : 
                        subscription.status === "active" ? "default" : 
                        "secondary"
                      }
                    >
                      {subscription.flagged_for_removal ? "Flagged for Removal" : subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingSubscription(subscription)}
                        disabled={subscription.flagged_for_removal}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleFlagForRemoval(subscription)}
                        disabled={subscription.flagged_for_removal}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingSubscription(subscription)}
                        disabled={subscription.flagged_for_removal}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {editingSubscription && (
        <EditSubscriptionDialog
          subscription={editingSubscription}
          open={!!editingSubscription}
          onOpenChange={(open) => !open && setEditingSubscription(null)}
          onSave={updateSubscription}
        />
      )}

      <AlertDialog
        open={!!deletingSubscription}
        onOpenChange={(open) => !open && setDeletingSubscription(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subscription for {deletingSubscription?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingSubscription) {
                  void deleteSubscription(deletingSubscription.id);
                  setDeletingSubscription(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}