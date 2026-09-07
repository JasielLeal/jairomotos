import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { formatCentsToBRL, formatRelativeTime } from "@/lib/format";
import type { OverviewData } from "@/app/dashboard/lib/get-overview-data";

export function RecentInvoicesCard({
  invoices,
}: {
  invoices: OverviewData["recentInvoices"];
}) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Notas recentes</CardTitle>
        <Link href="/dashboard/notas" className="text-xs text-muted-foreground hover:underline">
          ver todas
        </Link>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <EmptyState message="Nenhuma nota criada ainda." />
        ) : (
          <ul className="flex flex-col">
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                <Link
                  href={`/dashboard/notas/${invoice.id}`}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm hover:bg-muted/60"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {invoice.customer.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate font-medium text-foreground">
                        {invoice.customer.name} · #{invoice.number}
                      </span>
                      <span className="shrink-0 font-medium tabular-nums text-foreground">
                        {formatCentsToBRL(invoice.totalCents)}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(invoice.createdAt)}
                      </span>
                      <InvoiceStatusBadge status={invoice.status} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
