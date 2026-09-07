import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCentsToBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { INVOICE_STATUS_BAR, INVOICE_STATUS_LABEL } from "@/app/dashboard/lib/utils";
import type { InvoiceStatusBreakdownItem } from "@/app/dashboard/lib/types";

export function InvoiceStatusCard({
  breakdown,
  totalInvoicedCents,
}: {
  breakdown: InvoiceStatusBreakdownItem[];
  totalInvoicedCents: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas por status</CardTitle>
        <p className="text-xs text-muted-foreground">Distribuição de todas as notas</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {breakdown.map(({ status, count, percent }) => (
          <div key={status}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{INVOICE_STATUS_LABEL[status]}</span>
              <span className="text-muted-foreground">
                {count} <span className="font-medium text-foreground">{percent}%</span>
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", INVOICE_STATUS_BAR[status])}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ))}

        <div className="mt-1 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">Valor total em notas</span>
          <span className="font-heading font-semibold text-foreground">
            {formatCentsToBRL(totalInvoicedCents)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
