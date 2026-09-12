import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BoletoAlerts } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/get-boletos";

export function BoletosAlert({ overdue, dueSoon }: BoletoAlerts) {
  const items = [
    ...overdue.map((b) => ({ ...b, isOverdue: true })),
    ...dueSoon.map((b) => ({ ...b, isOverdue: false })),
  ];
  if (items.length === 0) return null;

  return (
    <Card className="border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <TriangleAlert className="size-4.5" />
          {overdue.length > 0
            ? `${overdue.length} boleto(s) vencido(s)`
            : `${dueSoon.length} boleto(s) vencendo em breve`}
        </CardTitle>
        <Link href="/dashboard/financeiro/boletos" className="text-xs text-muted-foreground hover:underline">
          ver boletos
        </Link>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1">
          {items.slice(0, 5).map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm">
              <span className="text-foreground">{b.description}</span>
              <span
                className={
                  b.isOverdue
                    ? "font-semibold text-red-600 dark:text-red-400"
                    : "font-medium text-amber-700 dark:text-amber-400"
                }
              >
                {formatDate(b.dueDate)} · {formatCentsToBRL(b.amountCents)}
              </span>
            </li>
          ))}
        </ul>
        {items.length > 5 && (
          <p className="mt-2 px-2 text-xs text-muted-foreground">e mais {items.length - 5} boleto(s)...</p>
        )}
      </CardContent>
    </Card>
  );
}
