import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { formatCentsToBRL } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

export function FinanceStats({ revenue, expense }: { revenue: number; expense: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Receita do mês</p>
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
            <p className="text-sm text-muted-foreground">Despesa do mês</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-red-600 dark:text-red-400">
              {formatCentsToBRL(expense)}
            </p>
          </div>
          <TrendingDown className="size-8 text-red-500/40" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Saldo do mês</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-foreground">
              {formatCentsToBRL(revenue - expense)}
            </p>
          </div>
          <Wallet className="size-8 text-muted-foreground/40" />
        </CardContent>
      </Card>
    </div>
  );
}
