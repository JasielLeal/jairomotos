import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TransactionTypeFilter } from "@/app/dashboard/(pages)/financeiro/lib/get-transactions";

const FILTERS: { label: string; value: TransactionTypeFilter }[] = [
  { label: "Todos", value: undefined },
  { label: "Receitas", value: "RECEITA" },
  { label: "Despesas", value: "DESPESA" },
];

export function FinanceFilters({
  typeFilter,
  query,
}: {
  typeFilter: TransactionTypeFilter;
  query?: string;
}) {
  function filterHref(value?: string) {
    const params = new URLSearchParams();
    if (value) params.set("tipo", value);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/dashboard/financeiro?${qs}` : "/dashboard/financeiro";
  }

  return (
    <div className="flex gap-2">
      {FILTERS.map((f) => (
        <Link
          key={f.label}
          href={filterHref(f.value)}
          className={cn(
            "flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
            f.value === typeFilter
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
