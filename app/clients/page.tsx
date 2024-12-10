"use client";

import { ClientList } from "@/components/clients/list";
import { ClientHeader } from "@/components/clients/header";

export default function ClientsPage(): JSX.Element {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <ClientHeader />
        <ClientList />
      </div>
    </div>
  );
}