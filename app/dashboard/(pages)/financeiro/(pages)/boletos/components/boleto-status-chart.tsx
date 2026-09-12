"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipContentProps } from "recharts";
import { formatCentsToBRL } from "@/lib/format";
import type { BoletoStats } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/get-boletos";

const SLICES = [
  { key: "upcoming", label: "A vencer", color: "var(--color-blue-500)" },
  { key: "dueSoon", label: "Vencendo", color: "var(--color-amber-500)" },
  { key: "overdue", label: "Vencido", color: "var(--color-red-500)" },
] as const;

type SliceDatum = {
  key: string;
  label: string;
  color: string;
  count: number;
  amountCents: number;
};

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload as SliceDatum | undefined;
  if (!data) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{data.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {data.count} boleto{data.count === 1 ? "" : "s"} ·{" "}
        <span className="font-medium text-popover-foreground">{formatCentsToBRL(data.amountCents)}</span>
      </p>
    </div>
  );
}

export function BoletoStatusChart({ stats }: { stats: BoletoStats }) {
  const data: SliceDatum[] = SLICES.map(({ key, label, color }) => ({
    key,
    label,
    color,
    count: stats[key].count,
    amountCents: stats[key].amountCents,
  }));

  const hasData = stats.openCents > 0;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto h-[220px] w-[220px] shrink-0">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amountCents"
                nameKey="label"
                innerRadius={64}
                outerRadius={100}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={(props) => <ChartTooltip {...props} />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-border p-6 text-center">
            <span className="text-xs text-muted-foreground">Nenhum boleto em aberto</span>
          </div>
        )}
        {hasData && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Em aberto</span>
            <span className="font-heading text-lg font-semibold text-foreground">
              {formatCentsToBRL(stats.openCents)}
            </span>
          </div>
        )}
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {data.map((entry) => (
          <li key={entry.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.label}
            </span>
            <span className="text-right text-muted-foreground">
              <span className="font-medium text-foreground">{formatCentsToBRL(entry.amountCents)}</span>
              {" · "}
              {entry.count} boleto{entry.count === 1 ? "" : "s"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
