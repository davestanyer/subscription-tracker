"use client";

import { Card } from "@/components/ui/card";
import { XeroSettings } from "@/components/settings/xero-settings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="space-y-6">
        <Card className="p-6">
          <XeroSettings />
        </Card>
      </div>
    </div>
  );
}
