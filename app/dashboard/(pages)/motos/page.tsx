import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SearchForm } from "@/components/search-form";
import { PaginationBar } from "@/components/pagination-bar";
import { MotorcyclesTable } from "@/app/dashboard/(pages)/motos/components/motorcycles-table";
import { MotorcycleFilters } from "@/app/dashboard/(pages)/motos/components/motorcycle-filters";
import { getMotorcycles } from "@/app/dashboard/(pages)/motos/lib/get-motorcycles";
import type { MotorcycleStatus } from "@prisma/client";

const VALID_STATUSES: MotorcycleStatus[] = ["AVAILABLE", "RESERVED", "SOLD"];

export default async function MotosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim();
  const statusFilter = VALID_STATUSES.includes(status as MotorcycleStatus)
    ? (status as MotorcycleStatus)
    : undefined;

  const { motorcycles, total, totalPages } = await getMotorcycles({
    query,
    status: statusFilter,
    page,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Motos"
        description={`${total} moto(s) cadastrada(s)`}
        action={{ label: "Nova moto", href: "/dashboard/motos/novo", icon: <Plus className="size-4" /> }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <MotorcycleFilters status={statusFilter} query={query} />

        <SearchForm
          action="/dashboard/motos"
          placeholder="Buscar por marca, modelo ou placa..."
          defaultValue={q}
          hiddenParams={{ status: statusFilter }}
        />
      </div>

      <MotorcyclesTable
        motorcycles={motorcycles}
        emptyMessage={query || statusFilter ? "Nenhuma moto encontrada." : "Nenhuma moto cadastrada ainda."}
      />

      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/motos"
        searchParams={{ q, status: statusFilter }}
      />
    </div>
  );
}
