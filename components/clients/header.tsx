"use client";

import { AddClientDialog } from "./add-client-dialog";
import { useClients } from "@/hooks/use-clients";
import { Card } from "@/components/ui/card";
import { Building2, Users } from "lucide-react";

export function ClientHeader() {
  const { data: clients } = useClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <AddClientDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <p className="text-2xl font-bold">{clients?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Clients</p>
              <p className="text-2xl font-bold">
                {clients?.filter(client => client.status === 'active')?.length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}