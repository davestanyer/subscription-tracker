"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface XeroSettings {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

export function XeroSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<XeroSettings>({
    clientId: "",
    clientSecret: "",
    tenantId: "",
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem("xeroSettings");
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error('Failed to parse saved settings:', error);
        }
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem("xeroSettings", JSON.stringify(settings));
      toast({
        title: "Settings saved",
        description: "Your Xero integration settings have been saved successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Xero Integration</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure your Xero integration settings to sync subscription data with
          your accounting system.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            value={settings.clientId}
            onChange={(e) =>
              setSettings({ ...settings, clientId: e.target.value })
            }
            placeholder="Enter your Xero Client ID"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientSecret">Client Secret</Label>
          <Input
            id="clientSecret"
            type="password"
            value={settings.clientSecret}
            onChange={(e) =>
              setSettings({ ...settings, clientSecret: e.target.value })
            }
            placeholder="Enter your Xero Client Secret"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenantId">Tenant ID</Label>
          <Input
            id="tenantId"
            value={settings.tenantId}
            onChange={(e) =>
              setSettings({ ...settings, tenantId: e.target.value })
            }
            placeholder="Enter your Xero Tenant ID"
          />
        </div>

        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}
