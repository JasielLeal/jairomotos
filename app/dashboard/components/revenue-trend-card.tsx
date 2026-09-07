import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueTrendChart } from "@/app/dashboard/components/revenue-trend-chart";
import type { RevenueTrendPoint } from "@/app/dashboard/lib/types";

export function RevenueTrendCard({ points }: { points: RevenueTrendPoint[] }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Faturamento</CardTitle>
          <p className="text-xs text-muted-foreground">Receita x despesa nos últimos 12 meses</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> Receita
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-red-500" /> Despesa
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <RevenueTrendChart data={points} />
      </CardContent>
    </Card>
  );
}
