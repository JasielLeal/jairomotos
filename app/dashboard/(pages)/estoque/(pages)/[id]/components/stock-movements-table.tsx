import { EmptyState } from "@/components/empty-state";
import { formatDateTime } from "@/lib/format";
import { MOVEMENT_CLASS, MOVEMENT_LABEL } from "@/app/dashboard/(pages)/estoque/(pages)/[id]/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { getProductDetail } from "@/app/dashboard/(pages)/estoque/(pages)/[id]/lib/get-product-detail";

export function StockMovementsTable({
  movements,
}: {
  movements: NonNullable<Awaited<ReturnType<typeof getProductDetail>>>["movements"];
}) {
  if (movements.length === 0) {
    return <EmptyState message="Nenhuma movimentação registrada." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead>Motivo</TableHead>
          <TableHead>Usuário</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="text-muted-foreground">{formatDateTime(m.createdAt)}</TableCell>
            <TableCell className={`font-medium ${MOVEMENT_CLASS[m.type]}`}>
              {MOVEMENT_LABEL[m.type]}
            </TableCell>
            <TableCell className="text-right tabular-nums">{m.quantity}</TableCell>
            <TableCell className="text-muted-foreground">{m.reason || "—"}</TableCell>
            <TableCell className="text-muted-foreground">{m.user.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
