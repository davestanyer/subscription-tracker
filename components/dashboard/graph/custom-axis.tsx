"use client";

import { useTheme } from "next-themes";

interface AxisProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  stroke?: string;
  children?: React.ReactNode;
}

export function XAxis(props: AxisProps) {
  const { theme } = useTheme();
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 30,
    stroke = theme === "dark" ? "hsl(var(--muted-foreground))" : "#888",
    children
  } = props;

  return (
    <g className="recharts-cartesian-axis recharts-xaxis xAxis">
      <g className="recharts-cartesian-axis-ticks" transform={`translate(${x},${y})`}>
        {children}
      </g>
    </g>
  );
}

export function YAxis(props: AxisProps) {
  const { theme } = useTheme();
  const {
    x = 0,
    y = 0,
    width = 60,
    height = 0,
    stroke = theme === "dark" ? "hsl(var(--muted-foreground))" : "#888",
    children
  } = props;

  return (
    <g className="recharts-cartesian-axis recharts-yaxis yAxis">
      <g className="recharts-cartesian-axis-ticks" transform={`translate(${x},${y})`}>
        {children}
      </g>
    </g>
  );
}