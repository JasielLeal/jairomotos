import Link from "next/link";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { getInvoiceDetail } from "@/app/dashboard/(pages)/notas/(pages)/[id]/lib/get-invoice-detail";

export function InvoiceSummaryCard({
  invoice,
  subtotalCents,
}: {
  invoice: NonNullable<Awaited<ReturnType<typeof getInvoiceDetail>>>["invoice"];
  subtotalCents: number;
}) {
  const remainderBoleto = invoice.boletos.find((b) => b.status !== "CANCELADO");

  return (
    <Card className="lg:col-span-2">
      <CardContent className="flex flex-col gap-6">
        {invoice.items.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Itens</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity} {item.product.unit}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      {formatCentsToBRL(item.unitPriceCents)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCentsToBRL(item.subtotalCents)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {invoice.services.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Serviços</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.description}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCentsToBRL(service.amountCents)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex flex-col gap-1 border-t border-border pt-4">
          {invoice.discountCents > 0 && (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCentsToBRL(subtotalCents)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Desconto</span>
                <span className="tabular-nums">-{formatCentsToBRL(invoice.discountCents)}</span>
              </div>
            </>
          )}
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-heading text-lg font-semibold text-foreground tabular-nums">
              {formatCentsToBRL(invoice.totalCents)}
            </span>
          </div>

          {invoice.status === "PARTIAL" && (
            <>
              <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
                <span>Pago (entrada)</span>
                <span className="font-medium tabular-nums">{formatCentsToBRL(invoice.paidCents)}</span>
              </div>
              {remainderBoleto && (
                <div className="flex items-center justify-between text-sm text-amber-600 dark:text-amber-400">
                  <span>Restante · vence em {formatDate(remainderBoleto.dueDate)}</span>
                  <span className="font-medium tabular-nums">
                    {formatCentsToBRL(remainderBoleto.amountCents)}
                  </span>
                </div>
              )}
              <Link
                href="/dashboard/financeiro/boletos"
                className="text-xs text-muted-foreground hover:underline"
              >
                ver na lista de boletos
              </Link>
            </>
          )}
        </div>

        {invoice.notes && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Observações: </span>
            {invoice.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
