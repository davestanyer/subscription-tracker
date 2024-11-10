"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useClients } from "@/hooks/use-clients";
import { supabase } from "@/lib/supabase";

const CURRENCIES = ['USD', 'NZD', 'AUD', 'EUR'] as const;
type Currency = typeof CURRENCIES[number];

interface AddSubscriptionDialogProps {
  onSubscriptionAdded?: () => void;
}

export function AddSubscriptionDialog({ onSubscriptionAdded }: AddSubscriptionDialogProps) {
  const { addSubscription, refresh } = useSubscriptions();
  const { data: clients } = useClients();
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    currency: "USD" as Currency,
    frequency: "monthly",
    next_billing_date: "",
    status: "active",
    website_url: "",
    client_id: null as string | null,
    user_id: null as string | null,
  });

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from('users').select('*').order('name');
      if (data) setUsers(data);
    }
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let logo_url = "";
    if (formData.website_url) {
      try {
        const domain = new URL(formData.website_url).hostname;
        logo_url = `https://logo.clearbit.com/${domain}`;
      } catch (error) {
        console.error('Invalid URL:', error);
      }
    }

    const subscriptionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      logo_url,
    };

    if (formData.client_id) {
      subscriptionData.client_id = formData.client_id;
    }
    if (formData.user_id) {
      subscriptionData.user_id = formData.user_id;
    }

    await addSubscription(subscriptionData as any);
    
    setOpen(false);
    setFormData({
      name: "",
      amount: "",
      currency: "USD",
      frequency: "monthly",
      next_billing_date: "",
      status: "active",
      website_url: "",
      client_id: null,
      user_id: null,
    });
    
    refresh();
    onSubscriptionAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL (Optional)</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) =>
                setFormData({ ...formData, website_url: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value: Currency) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Billing Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) =>
                setFormData({ ...formData, frequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_billing_date">Next Billing Date</Label>
            <Input
              id="next_billing_date"
              type="date"
              value={formData.next_billing_date}
              onChange={(e) =>
                setFormData({ ...formData, next_billing_date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client (Optional)</Label>
            <Select
              value={formData.client_id || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, client_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">User (Optional)</Label>
            <Select
              value={formData.user_id || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, user_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Add Subscription
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
