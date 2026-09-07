import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { formatCentsToBRL } from "@/lib/format";
import type { TopPerformer } from "@/app/dashboard/lib/types";

export function TopPerformersCard({ performers }: { performers: TopPerformer[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Funcionários do mês</CardTitle>
        <Trophy className="size-4 text-amber-500" />
      </CardHeader>
      <CardContent>
        {performers.length === 0 ? (
          <EmptyState message="Nenhuma nota emitida este mês ainda." />
        ) : (
          <ul className="flex flex-col gap-1">
            {performers.map((p, i) => (
              <li key={p.userId} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i === 0 ? <Trophy className="size-4" /> : p.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate font-medium text-foreground">{p.name}</span>
                    <span className="shrink-0 font-medium tabular-nums text-foreground">
                      {formatCentsToBRL(p.totalCents)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {p.invoiceCount} {p.invoiceCount === 1 ? "nota" : "notas"} emitida
                    {p.invoiceCount === 1 ? "" : "s"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
