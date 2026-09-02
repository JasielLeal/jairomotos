import { notFound } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { db } from "@/lib/db";
import { formatCentsToBRL, formatDateTime } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditProductForm from "./edit-form";
import ProductPhotoForm from "./photo-form";
import StockMovementForm from "./stock-movement-form";

const MOVEMENT_LABEL: Record<string, string> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  AJUSTE: "Ajuste",
};

const MOVEMENT_CLASS: Record<string, string> = {
  ENTRADA: "text-emerald-600 dark:text-emerald-400",
  SAIDA: "text-red-600 dark:text-red-400",
  AJUSTE: "text-amber-600 dark:text-amber-400",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  const movements = await db.stockMovement.findMany({
    where: { productId: id },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { user: { select: { name: true } } },
  });

  const low = product.quantity <= product.minStock;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          {product.name}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          {product.category} · Estoque atual:{" "}
          <span
            className={
              low
                ? "inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400"
                : "font-semibold text-foreground"
            }
          >
            {low && <TriangleAlert className="size-3.5" />}
            {product.quantity} {product.unit}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Editar produto</CardTitle>
          </CardHeader>
          <CardContent>
            <EditProductForm product={product} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foto do produto</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductPhotoForm productId={product.id} imageData={product.imageData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de movimentações</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <StockMovementForm productId={product.id} />

          <Separator />

          {movements.length === 0 ? (
            <EmptyState message="Nenhuma movimentação registrada." />
          ) : (
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
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(m.createdAt)}
                    </TableCell>
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
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Custo: {formatCentsToBRL(product.costCents)} · Margem:{" "}
        {formatCentsToBRL(product.priceCents - product.costCents)}
      </p>
    </div>
  );
}
