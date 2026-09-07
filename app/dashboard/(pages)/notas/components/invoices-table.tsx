import Link from "next/link";
import { FileText } from "lucide-react";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { ClickableRow } from "@/components/clickable-row";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { getInvoices } from "@/app/dashboard/(pages)/notas/lib/get-invoices";

export function InvoicesTable({
  invoices,
  emptyMessage,
}: {
  invoices: Awaited<ReturnType<typeof getInvoices>>["invoices"];
  emptyMessage: string;
}) {
  return (
    <Card className="py-0">
      {invoices.length === 0 ? (
        <EmptyState icon={<FileText className="size-10" />} message={emptyMessage} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <ClickableRow key={invoice.id} href={`/dashboard/notas/${invoice.id}`}>
                <TableCell>
                  <Link
                    href={`/dashboard/notas/${invoice.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    #{invoice.number}
                  </Link>
                </TableCell>
                <TableCell className="text-foreground">{invoice.customer.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(invoice.issuedAt)}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCentsToBRL(invoice.totalCents)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
              </ClickableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
