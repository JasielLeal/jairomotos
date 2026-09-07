import { formatCentsToBRL, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { getMotorcycleDetail } from "@/app/dashboard/(pages)/motos/(pages)/[id]/lib/get-motorcycle-detail";

export function MotoTransactionsTable({
  transactions,
}: {
  transactions: NonNullable<Awaited<ReturnType<typeof getMotorcycleDetail>>>["transactions"];
}) {
  if (transactions.length === 0) {
    return <EmptyState message="Nenhum lançamento registrado para esta moto ainda." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="text-muted-foreground">{formatDate(t.date)}</TableCell>
            <TableCell className="text-foreground">{t.description}</TableCell>
            <TableCell className="text-muted-foreground">{t.category}</TableCell>
            <TableCell className="text-muted-foreground">{t.createdBy.name}</TableCell>
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
  );
}
