import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PaginationBar } from "@/components/pagination-bar";
import { verifySession } from "@/lib/dal";
import { MotoFinanceStats } from "@/app/dashboard/(pages)/motos/(pages)/financeiro/components/moto-finance-stats";
import { MotoFinanceFilters } from "@/app/dashboard/(pages)/motos/(pages)/financeiro/components/moto-finance-filters";
import { MotoFinanceTable } from "@/app/dashboard/(pages)/motos/(pages)/financeiro/components/moto-finance-table";
import { getMotoFinance, type MotoTransactionTypeFilter } from "@/app/dashboard/(pages)/motos/(pages)/financeiro/lib/get-moto-finance";

export default async function MotoFinancePage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; page?: string }>;
}) {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/dashboard/estoque");
  }

  const { tipo, page: pageParam } = await searchParams;
  const typeFilter: MotoTransactionTypeFilter =
    tipo === "RECEITA" ? "RECEITA" : tipo === "DESPESA" ? "DESPESA" : undefined;
  const page = Math.max(1, Number(pageParam) || 1);

  const { transactions, totalPages, invested, revenue, profit, stockCount, soldCount } =
    await getMotoFinance({ typeFilter, page });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Financeiro de motos"
        description="Lançamentos gerados por compra/venda de motos e ajustes manuais — separado do financeiro de peças e notas."
      />

      <MotoFinanceStats
        invested={invested}
        revenue={revenue}
        profit={profit}
        stockCount={stockCount}
        soldCount={soldCount}
      />

      <MotoFinanceFilters typeFilter={typeFilter} />

      <MotoFinanceTable transactions={transactions} />

      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/motos/financeiro"
        searchParams={{ tipo: typeFilter }}
      />
    </div>
  );
}
