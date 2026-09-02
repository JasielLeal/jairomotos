import Link from "next/link";
import { Plus, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { db } from "@/lib/db";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { TransactionStatusBadge } from "@/components/status-badge";
import { SearchForm } from "@/components/search-form";
import { PaginationBar, PAGE_SIZE } from "@/components/pagination-bar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; q?: string; page?: string }>;
}) {
  const { tipo, q, page: pageParam } = await searchParams;
  const typeFilter: "RECEITA" | "DESPESA" | undefined =
    tipo === "RECEITA" ? "RECEITA" : tipo === "DESPESA" ? "DESPESA" : undefined;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const where = {
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(query
      ? {
          OR: [
            { description: { contains: query, mode: "insensitive" as const } },
            { category: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [monthTransactions, transactions, total] = await Promise.all([
    db.financialTransaction.findMany({
      where: { date: { gte: startOfMonth }, status: { not: "CANCELADO" } },
    }),
    db.financialTransaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { invoice: { select: { number: true } } },
    }),
    db.financialTransaction.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const revenue = monthTransactions
    .filter((t) => t.type === "RECEITA")
    .reduce((sum, t) => sum + t.amountCents, 0);
  const expense = monthTransactions
    .filter((t) => t.type === "DESPESA")
    .reduce((sum, t) => sum + t.amountCents, 0);

  const filters = [
    { label: "Todos", value: undefined, active: !typeFilter },
    { label: "Receitas", value: "RECEITA", active: typeFilter === "RECEITA" },
    { label: "Despesas", value: "DESPESA", active: typeFilter === "DESPESA" },
  ];

  function filterHref(value?: string) {
    const params = new URLSearchParams();
    if (value) params.set("tipo", value);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/dashboard/financeiro?${qs}` : "/dashboard/financeiro";
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Financeiro"
        description="Lançamentos manuais e gerados automaticamente por notas aprovadas"
        action={{
          label: "Novo lançamento",
          href: "/dashboard/financeiro/novo",
          icon: <Plus className="size-4" />,
        }}
      />

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={filterHref(f.value)}
              className={cn(
                "flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
                f.active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <SearchForm
          action="/dashboard/financeiro"
          placeholder="Buscar por descrição ou categoria..."
          defaultValue={q}
          hiddenParams={{ tipo: typeFilter }}
        />
      </div>

      <Card className="py-0">
        {transactions.length === 0 ? (
          <EmptyState message="Nenhum lançamento encontrado." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground">{formatDate(t.date)}</TableCell>
                  <TableCell className="text-foreground">
                    {t.description}
                    {t.invoice && (
                      <Link
                        href={`/dashboard/notas/${t.invoiceId}`}
                        className="ml-2 text-xs text-muted-foreground hover:underline"
                      >
                        nota #{t.invoice.number}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.category}</TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={t.status} />
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium tabular-nums",
                      t.type === "RECEITA"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {t.type === "RECEITA" ? "+" : "-"}
                    {formatCentsToBRL(t.amountCents)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/financeiro"
        searchParams={{ q, tipo: typeFilter }}
      />
    </div>
  );
}
