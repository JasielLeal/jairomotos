import Link from "next/link";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { StatusPill } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BoletoRowActions } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/components/boleto-row-actions";
import { BOLETO_DUE_SOON_DAYS } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/get-boletos";
import type { getBoletos } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/get-boletos";

type Boleto = Awaited<ReturnType<typeof getBoletos>>["boletos"][number];

function boletoUrgency(boleto: Boleto) {
  if (boleto.status === "PAGO") return { label: "Pago", tone: "success" as const };
  if (boleto.status === "CANCELADO") return { label: "Cancelado", tone: "neutral" as const };

  const now = new Date();
  const daysLeft = Math.ceil((boleto.dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

  if (daysLeft < 0) return { label: "Vencido", tone: "danger" as const };
  if (daysLeft <= BOLETO_DUE_SOON_DAYS) {
    return { label: daysLeft === 0 ? "Vence hoje" : `Vence em ${daysLeft}d`, tone: "warning" as const };
  }
  return { label: "Pendente", tone: "neutral" as const };
}

export function BoletosTable({ boletos }: { boletos: Boleto[] }) {
  return (
    <Card className="py-0">
      {boletos.length === 0 ? (
        <EmptyState message="Nenhum boleto encontrado." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vencimento</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boletos.map((boleto) => {
              const urgency = boletoUrgency(boleto);
              return (
                <TableRow key={boleto.id}>
                  <TableCell className="text-muted-foreground">{formatDate(boleto.dueDate)}</TableCell>
                  <TableCell className="text-foreground">
                    {boleto.description}
                    {boleto.invoice && (
                      <Link
                        href={`/dashboard/notas/${boleto.invoiceId}`}
                        className="ml-2 text-xs text-muted-foreground hover:underline"
                      >
                        nota #{boleto.invoice.number}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusPill label={urgency.label} tone={urgency.tone} />
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium tabular-nums",
                      boleto.type === "RECEITA"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {boleto.type === "RECEITA" ? "+" : "-"}
                    {formatCentsToBRL(boleto.amountCents)}
                  </TableCell>
                  <TableCell>
                    <BoletoRowActions boletoId={boleto.id} status={boleto.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
