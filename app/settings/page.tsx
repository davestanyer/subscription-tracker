import { Metadata } from 'next';
import { Card } from "@/components/ui/card";
import { XeroSettings } from "@/components/settings/xero-settings";

export const metadata: Metadata = {
  title: 'Settings - Subscription Manager',
  description: 'Configure your subscription management settings',
};

export default async function SettingsPage() {
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
