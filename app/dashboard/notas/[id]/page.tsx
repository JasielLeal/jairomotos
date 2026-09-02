import { notFound } from "next/navigation";
import { MessageCircle, TriangleAlert } from "lucide-react";
import { db } from "@/lib/db";
import { formatCentsToBRL, formatDateTime } from "@/lib/format";
import { buildInvoiceMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvoiceActionsPanel from "./actions-panel";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      createdBy: { select: { name: true } },
      items: { include: { product: { select: { name: true, unit: true } } } },
      services: true,
    },
  });

  if (!invoice) notFound();

  const subtotalCents = invoice.totalCents + invoice.discountCents;

  const whatsappMessage = buildInvoiceMessage({
    number: invoice.number,
    customerName: invoice.customer.name,
    items: invoice.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit,
      subtotalCents: item.subtotalCents,
    })),
    services: invoice.services,
    discountCents: invoice.discountCents,
    totalCents: invoice.totalCents,
  });
  const whatsappLink = buildWhatsAppLink(invoice.customer.phone, whatsappMessage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Nota #{invoice.number}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.customer.name} · Criada em {formatDateTime(invoice.createdAt)} por{" "}
            {invoice.createdBy.name}
          </p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
            </div>

            {invoice.notes && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Observações: </span>
                {invoice.notes}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {whatsappLink ? (
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="w-full border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
                render={<a href={whatsappLink} target="_blank" rel="noopener noreferrer" />}
              >
                <MessageCircle className="size-4" />
                Enviar por WhatsApp
              </Button>
            ) : (
              <p className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                <TriangleAlert className="size-4 shrink-0" />
                Cliente sem telefone cadastrado.
              </p>
            )}
            <InvoiceActionsPanel invoiceId={invoice.id} status={invoice.status} />
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              {invoice.approvedAt && <p>Aprovada em {formatDateTime(invoice.approvedAt)}</p>}
              {invoice.canceledAt && <p>Cancelada em {formatDateTime(invoice.canceledAt)}</p>}
              {invoice.status === "PENDING" && (
                <p>Ao aprovar, o estoque dos itens é baixado e a receita entra no financeiro.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
