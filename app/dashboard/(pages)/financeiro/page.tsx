import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SearchForm } from "@/components/search-form";
import { PaginationBar } from "@/components/pagination-bar";
import { verifySession } from "@/lib/dal";
import { FinanceStats } from "@/app/dashboard/(pages)/financeiro/components/finance-stats";
import { FinanceFilters } from "@/app/dashboard/(pages)/financeiro/components/finance-filters";
import { TransactionsTable } from "@/app/dashboard/(pages)/financeiro/components/transactions-table";
import { getTransactions, type TransactionTypeFilter } from "@/app/dashboard/(pages)/financeiro/lib/get-transactions";

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; q?: string; page?: string }>;
}) {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/dashboard/estoque");
  }

  const { tipo, q, page: pageParam } = await searchParams;
  const typeFilter: TransactionTypeFilter =
    tipo === "RECEITA" ? "RECEITA" : tipo === "DESPESA" ? "DESPESA" : undefined;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim();

  const { transactions, totalPages, revenue, expense } = await getTransactions({
    typeFilter,
    query,
    page,
  });

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

      <FinanceStats revenue={revenue} expense={expense} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FinanceFilters typeFilter={typeFilter} query={query} />

        <SearchForm
          action="/dashboard/financeiro"
          placeholder="Buscar por descrição ou categoria..."
          defaultValue={q}
          hiddenParams={{ tipo: typeFilter }}
        />
      </div>

      <TransactionsTable transactions={transactions} />

      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/financeiro"
        searchParams={{ q, tipo: typeFilter }}
      />
    </div>
  );
}
