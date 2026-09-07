import { Clock, Package, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/app/dashboard/components/stat-card";
import { formatCentsToBRL } from "@/lib/format";
import type { OverviewData } from "@/app/dashboard/lib/get-overview-data";

export function StatsGrid({
  data,
}: {
  data: Pick<
    OverviewData,
    "revenue" | "expense" | "balance" | "pendingInvoices" | "productCount" | "revenueTrend"
  >;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Receita do mês"
        value={formatCentsToBRL(data.revenue)}
        icon={TrendingUp}
        trend={data.revenueTrend.revenueDelta}
      />
      <StatCard
        label="Despesa do mês"
        value={formatCentsToBRL(data.expense)}
        icon={TrendingDown}
        trend={data.revenueTrend.expenseDelta}
        invertTrendTone
      />
      <StatCard label="Saldo do mês" value={formatCentsToBRL(data.balance)} icon={Wallet} />
      <StatCard label="Notas pendentes" value={String(data.pendingInvoices)} icon={Clock} />
      <StatCard label="Produtos ativos" value={String(data.productCount)} icon={Package} />
    </div>
  );
}
