import { FileText, MessageCircle, Pencil, TriangleAlert } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InvoiceActionsPanel from "@/app/dashboard/(pages)/notas/(pages)/[id]/components/invoice-actions-panel";
import type { getInvoiceDetail } from "@/app/dashboard/(pages)/notas/(pages)/[id]/lib/get-invoice-detail";

export function InvoiceActionsCard({
  invoice,
  whatsappLink,
}: {
  invoice: NonNullable<Awaited<ReturnType<typeof getInvoiceDetail>>>["invoice"];
  whatsappLink: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          className="w-full"
          render={<a href={`/dashboard/notas/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer" />}
        >
          <FileText className="size-4" />
          Baixar/Ver PDF
        </Button>
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
        {invoice.status !== "CANCELED" && (
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            className="w-full"
            render={<a href={`/dashboard/notas/${invoice.id}/editar`} />}
          >
            <Pencil className="size-4" />
            Editar nota
          </Button>
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
  );
}
