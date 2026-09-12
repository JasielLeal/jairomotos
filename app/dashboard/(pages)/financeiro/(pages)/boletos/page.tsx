import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PaginationBar } from "@/components/pagination-bar";
import { verifySession } from "@/lib/dal";
import { BoletoFilters } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/components/boleto-filters";
import { BoletosTable } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/components/boletos-table";
import { BoletosAlert } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/components/boletos-alert";
import {
  getBoletos,
  getBoletoAlerts,
  type BoletoStatusFilter,
} from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/get-boletos";

export default async function BoletosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/dashboard/estoque");
  }

  const { status, page: pageParam } = await searchParams;
  const statusFilter: BoletoStatusFilter =
    status === "PENDENTE" || status === "PAGO" || status === "CANCELADO" ? status : undefined;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ boletos, totalPages }, alerts] = await Promise.all([
    getBoletos({ statusFilter, page }),
    getBoletoAlerts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Boletos"
        description="Boletos a pagar e a receber, com aviso de vencimento próximo"
        action={{
          label: "Novo boleto",
          href: "/dashboard/financeiro/boletos/novo",
          icon: <Plus className="size-4" />,
        }}
      />

      <BoletosAlert overdue={alerts.overdue} dueSoon={alerts.dueSoon} />

      <BoletoFilters statusFilter={statusFilter} />

      <BoletosTable boletos={boletos} />

      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/financeiro/boletos"
        searchParams={{ status: statusFilter }}
      />
    </div>
  );
}
