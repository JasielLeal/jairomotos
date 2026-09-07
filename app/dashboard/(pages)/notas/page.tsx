import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SearchForm } from "@/components/search-form";
import { PaginationBar } from "@/components/pagination-bar";
import { InvoicesTable } from "@/app/dashboard/(pages)/notas/components/invoices-table";
import { getInvoices } from "@/app/dashboard/(pages)/notas/lib/get-invoices";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim();

  const { invoices, total, totalPages } = await getInvoices({ query, page });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notas"
        description={`${total} nota(s) emitida(s)`}
        action={{ label: "Nova nota", href: "/dashboard/notas/nova", icon: <Plus className="size-4" /> }}
      />

      <SearchForm
        action="/dashboard/notas"
        placeholder="Buscar por cliente ou nº da nota..."
        defaultValue={q}
      />

      <InvoicesTable
        invoices={invoices}
        emptyMessage={query ? "Nenhuma nota encontrada." : "Nenhuma nota criada ainda."}
      />

      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/notas"
        searchParams={{ q }}
      />
    </div>
  );
}
