import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BoletoStatusFilter } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/get-boletos";

const FILTERS: { label: string; value: BoletoStatusFilter }[] = [
  { label: "Todos", value: undefined },
  { label: "Pendentes", value: "PENDENTE" },
  { label: "Pagos", value: "PAGO" },
  { label: "Cancelados", value: "CANCELADO" },
];

export function BoletoFilters({ statusFilter }: { statusFilter: BoletoStatusFilter }) {
  function filterHref(value?: string) {
    if (!value) return "/dashboard/financeiro/boletos";
    return `/dashboard/financeiro/boletos?status=${value}`;
  }

  return (
    <div className="flex gap-2">
      {FILTERS.map((f) => (
        <Link
          key={f.label}
          href={filterHref(f.value)}
          className={cn(
            "flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
            f.value === statusFilter
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/70"
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}
