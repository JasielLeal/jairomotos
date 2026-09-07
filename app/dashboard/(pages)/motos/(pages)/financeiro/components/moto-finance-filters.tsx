import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MotoTransactionTypeFilter } from "@/app/dashboard/(pages)/motos/(pages)/financeiro/lib/get-moto-finance";

const FILTERS: { label: string; value: MotoTransactionTypeFilter }[] = [
  { label: "Todos", value: undefined },
  { label: "Receitas", value: "RECEITA" },
  { label: "Despesas", value: "DESPESA" },
];

export function MotoFinanceFilters({ typeFilter }: { typeFilter: MotoTransactionTypeFilter }) {
  function filterHref(value?: string) {
    return value ? `/dashboard/motos/financeiro?tipo=${value}` : "/dashboard/motos/financeiro";
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
