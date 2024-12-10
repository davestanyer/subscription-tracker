"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  TooltipProps
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface BillingData {
  date: string;
  month_end: string;
  amount: number;
}

interface ChartDataPoint {
  name: string;
  amount: number;
}

export function SubscriptionGraph() {
  const { theme } = useTheme();
  const [data, setData] = useState<BillingData[]>([]);

  useEffect(() => {
    async function fetchBillingSchedule() {
      const { data, error } = await supabase
        .from('billing_schedule')
        .select('*')
        .order('date');

      if (error) {
        console.error('Error fetching billing schedule:', error);
        return;
      }

      setData(data);
    }

    fetchBillingSchedule();
  }, []);

  const chartData = useMemo<ChartDataPoint[]>(() => 
    data.map(item => ({
      name: new Date(item.date).toLocaleDateString('default', { month: 'short' }),
      amount: item.amount
    })), 
    [data]
  );

  const maxAmount = useMemo(() => 
    Math.max(...chartData.map(item => item.amount), 0),
    [chartData]
  );

  const yAxisMax = useMemo(() => 
    Math.ceil(maxAmount / 1000) * 1000,
    [maxAmount]
  );

  const CustomTooltip = useMemo(() => {
    return function TooltipContent({ 
      active, 
      payload, 
      label 
    }: TooltipProps<ValueType, NameType>) {
      if (!active || !payload || !payload.length) return null;
      
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            {formatCurrency(payload[0].value as number, 'NZD')}
          </p>
        </div>
      );
    };
  }, []);

  const chartTheme = useMemo(() => ({
    gridColor: theme === "dark" ? "hsl(var(--muted-foreground))" : "#eee",
    axisColor: theme === "dark" ? "hsl(var(--muted-foreground))" : "#888",
    barColor: "hsl(var(--primary))"
  }), [theme]);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Projected Costs</h2>
        <p className="text-sm text-muted-foreground">Next 12 months subscription costs (NZD)</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 65, bottom: 25 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartTheme.gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke={chartTheme.axisColor}
              fontSize={12}
            >
              <Label
                value="Month"
                position="bottom"
                offset={15}
                style={{
                  fill: chartTheme.axisColor,
                  fontSize: 12
                }}
              />
            </XAxis>
            <YAxis
              stroke={chartTheme.axisColor}
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value, 'NZD')}
              domain={[0, yAxisMax]}
            >
              <Label
                value="Amount (NZD)"
                angle={-90}
                position="left"
                offset={-45}
                style={{
                  fill: chartTheme.axisColor,
                  fontSize: 12
                }}
              />
            </YAxis>
            <Tooltip content={CustomTooltip} />
            <Bar
              dataKey="amount"
              fill={chartTheme.barColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
