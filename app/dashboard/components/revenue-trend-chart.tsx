"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { formatCentsToBRL } from "@/lib/format";
import { formatCompactBRL } from "@/app/dashboard/lib/utils";
import type { RevenueTrendPoint } from "@/app/dashboard/lib/types";

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey as string} className="mt-1 flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-muted-foreground">
            {item.dataKey === "receitaCents" ? "Receita" : "Despesa"}
          </span>
          <span className="font-medium tabular-nums text-popover-foreground">
            {formatCentsToBRL(Number(item.value ?? 0))}
          </span>
        </p>
      ))}
    </div>
  );
}

export function RevenueTrendChart({ data }: { data: RevenueTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="receitaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-emerald-500)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-emerald-500)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="despesaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-red-500)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--color-red-500)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          tickFormatter={formatCompactBRL}
        />
        <Tooltip content={(props) => <ChartTooltip {...props} />} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="receitaCents"
          stroke="var(--color-emerald-500)"
          strokeWidth={2}
          fill="url(#receitaFill)"
        />
        <Area
          type="monotone"
          dataKey="despesaCents"
          stroke="var(--color-red-500)"
          strokeWidth={2}
          fill="url(#despesaFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
