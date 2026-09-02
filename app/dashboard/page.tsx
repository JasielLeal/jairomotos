import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Package,
  TriangleAlert,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

async function getOverviewData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [productCount, activeProducts, pendingInvoices, monthTransactions, recentInvoices] =
    await Promise.all([
      db.product.count({ where: { active: true } }),
      db.product.findMany({
        where: { active: true },
        orderBy: { quantity: "asc" },
      }),
      db.invoice.count({ where: { status: "PENDING" } }),
      db.financialTransaction.findMany({
        where: { date: { gte: startOfMonth }, status: { not: "CANCELADO" } },
      }),
      db.invoice.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { customer: true },
      }),
    ]);

  const lowStockProducts = activeProducts.filter((p) => p.quantity <= p.minStock).slice(0, 5);

  const revenue = monthTransactions
    .filter((t) => t.type === "RECEITA")
    .reduce((sum, t) => sum + t.amountCents, 0);
  const expense = monthTransactions
    .filter((t) => t.type === "DESPESA")
    .reduce((sum, t) => sum + t.amountCents, 0);

  return {
    productCount,
    lowStockProducts,
    pendingInvoices,
    revenue,
    expense,
    balance: revenue - expense,
    recentInvoices,
  };
}

export default async function DashboardOverviewPage() {
  const data = await getOverviewData();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Visão Geral
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo do mês atual — {formatDate(new Date())}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Receita do mês"
          value={formatCentsToBRL(data.revenue)}
          icon={TrendingUp}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Despesa do mês"
          value={formatCentsToBRL(data.expense)}
          icon={TrendingDown}
          accent="text-red-600 dark:text-red-400"
        />
        <StatCard
          label="Saldo do mês"
          value={formatCentsToBRL(data.balance)}
          icon={Wallet}
          accent="text-foreground"
        />
        <StatCard
          label="Notas pendentes"
          value={String(data.pendingInvoices)}
          icon={Clock}
          accent="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Produtos ativos"
          value={String(data.productCount)}
          icon={Package}
          accent="text-foreground"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Estoque baixo</CardTitle>
            <Link href="/dashboard/estoque" className="text-xs text-muted-foreground hover:underline">
              ver estoque
            </Link>
          </CardHeader>
          <CardContent>
            {data.lowStockProducts.length === 0 ? (
              <EmptyState message="Nenhum produto abaixo do estoque mínimo." />
            ) : (
              <ul className="flex flex-col gap-1">
                {data.lowStockProducts.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm"
                  >
                    <Link href={`/dashboard/estoque/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                    <span className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                      <TriangleAlert className="size-3.5" />
                      {p.quantity} {p.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Notas recentes</CardTitle>
            <Link href="/dashboard/notas" className="text-xs text-muted-foreground hover:underline">
              ver notas
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentInvoices.length === 0 ? (
              <EmptyState message="Nenhuma nota criada ainda." />
            ) : (
              <ul className="flex flex-col gap-1">
                {data.recentInvoices.map((invoice) => (
                  <li
                    key={invoice.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm"
                  >
                    <Link href={`/dashboard/notas/${invoice.id}`} className="hover:underline">
                      #{invoice.number} · {invoice.customer.name}
                    </Link>
                    <InvoiceStatusBadge status={invoice.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`font-heading mt-1 text-2xl font-semibold ${accent}`}>{value}</p>
        </div>
        <Icon className={`size-6 shrink-0 ${accent} opacity-50`} />
      </CardContent>
    </Card>
  );
}
