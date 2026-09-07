import Link from "next/link";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { TransactionStatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { getTransactions } from "@/app/dashboard/(pages)/financeiro/lib/get-transactions";

export function TransactionsTable({
  transactions,
}: {
  transactions: Awaited<ReturnType<typeof getTransactions>>["transactions"];
}) {
  return (
    <Card className="py-0">
      {transactions.length === 0 ? (
        <EmptyState message="Nenhum lançamento encontrado." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-muted-foreground">{formatDate(t.date)}</TableCell>
                <TableCell className="text-foreground">
                  {t.description}
                  {t.invoice && (
                    <Link
                      href={`/dashboard/notas/${t.invoiceId}`}
                      className="ml-2 text-xs text-muted-foreground hover:underline"
                    >
                      nota #{t.invoice.number}
                    </Link>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{t.category}</TableCell>
                <TableCell>
                  <TransactionStatusBadge status={t.status} />
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium tabular-nums",
                    t.type === "RECEITA"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {t.type === "RECEITA" ? "+" : "-"}
                  {formatCentsToBRL(t.amountCents)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
