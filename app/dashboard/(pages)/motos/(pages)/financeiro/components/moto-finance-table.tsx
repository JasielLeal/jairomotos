import Link from "next/link";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
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
import type { getMotoFinance } from "@/app/dashboard/(pages)/motos/(pages)/financeiro/lib/get-moto-finance";

export function MotoFinanceTable({
  transactions,
}: {
  transactions: Awaited<ReturnType<typeof getMotoFinance>>["transactions"];
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
              <TableHead>Moto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <ClickableRow key={t.id} href={`/dashboard/motos/${t.motorcycle.id}`}>
                <TableCell className="text-muted-foreground">{formatDate(t.date)}</TableCell>
                <TableCell className="text-foreground">
                  {t.description}
                  {t.category === "Venda" && t.motorcycle.buyerName && (
                    <span className="block text-xs text-muted-foreground">
                      Comprador: {t.motorcycle.buyerName}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/motos/${t.motorcycle.id}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {t.motorcycle.brand} {t.motorcycle.model} ({t.motorcycle.year})
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{t.category}</TableCell>
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
              </ClickableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
