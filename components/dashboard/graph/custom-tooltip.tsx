"use client";

import { formatCurrency } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
  currency?: string;
}

export function CustomTooltip({ active, payload, label, currency = 'USD' }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3">
      <p className="font-medium">{label}</p>
      {payload.map((item, index) => (
        <p key={index} className="text-sm">
          Total: {formatCurrency(item.value, currency)}
        </p>
      ))}
    </div>
  );
}