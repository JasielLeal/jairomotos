import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MotorcycleStatus } from "@prisma/client";

const FILTERS: { label: string; value: MotorcycleStatus | undefined }[] = [
  { label: "Todas", value: undefined },
  { label: "Disponíveis", value: "AVAILABLE" },
  { label: "Reservadas", value: "RESERVED" },
  { label: "Vendidas", value: "SOLD" },
];

export function MotorcycleFilters({
  status,
  query,
}: {
  status: MotorcycleStatus | undefined;
  query?: string;
}) {
  function filterHref(value?: string) {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/dashboard/motos?${qs}` : "/dashboard/motos";
  }

  return (
    <div className="flex gap-2">
      {FILTERS.map((f) => (
        <Link
          key={f.label}
          href={filterHref(f.value)}
          className={cn(
            "flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
            f.value === status
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
