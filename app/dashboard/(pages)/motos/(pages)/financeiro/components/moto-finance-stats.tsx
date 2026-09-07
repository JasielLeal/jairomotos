import { Bike, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { formatCentsToBRL } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

export function MotoFinanceStats({
  invested,
  revenue,
  profit,
  stockCount,
  soldCount,
}: {
  invested: number;
  revenue: number;
  profit: number;
  stockCount: number;
  soldCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Investido (total)</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-red-600 dark:text-red-400">
              {formatCentsToBRL(invested)}
            </p>
          </div>
          <TrendingDown className="size-8 text-red-500/40" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Vendido (total)</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCentsToBRL(revenue)}
            </p>
          </div>
          <TrendingUp className="size-8 text-emerald-500/40" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Lucro (total)</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-foreground">
              {formatCentsToBRL(profit)}
            </p>
          </div>
          <Wallet className="size-8 text-muted-foreground/40" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Em estoque / vendidas</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-foreground">
              {stockCount} / {soldCount}
            </p>
          </div>
          <Bike className="size-8 text-muted-foreground/40" />
        </CardContent>
      </Card>
    </div>
  );
}
