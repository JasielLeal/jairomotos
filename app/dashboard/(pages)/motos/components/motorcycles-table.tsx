import Link from "next/link";
import { Bike } from "lucide-react";
import { formatCentsToBRL } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { ClickableRow } from "@/components/clickable-row";
import { MotorcycleStatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { getMotorcycles } from "@/app/dashboard/(pages)/motos/lib/get-motorcycles";

export function MotorcyclesTable({
  motorcycles,
  emptyMessage,
}: {
  motorcycles: Awaited<ReturnType<typeof getMotorcycles>>["motorcycles"];
  emptyMessage: string;
}) {
  return (
    <Card className="py-0">
      {motorcycles.length === 0 ? (
        <EmptyState icon={<Bike className="size-10" />} message={emptyMessage} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14"></TableHead>
              <TableHead>Moto</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {motorcycles.map((moto) => (
              <ClickableRow key={moto.id} href={`/dashboard/motos/${moto.id}`}>
                <TableCell>
                  <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {moto.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={moto.images[0]}
                        alt={`${moto.brand} ${moto.model}`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Bike className="size-4 text-muted-foreground/40" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/motos/${moto.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {moto.brand} {moto.model}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{moto.year}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCentsToBRL(moto.status === "SOLD" && moto.soldPriceCents ? moto.soldPriceCents : moto.salePriceCents)}
                </TableCell>
                <TableCell>
                  <MotorcycleStatusBadge status={moto.status} />
                </TableCell>
              </ClickableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
