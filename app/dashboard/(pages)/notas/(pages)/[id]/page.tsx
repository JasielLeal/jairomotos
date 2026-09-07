import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/format";
import { getInvoiceDetail } from "@/app/dashboard/(pages)/notas/(pages)/[id]/lib/get-invoice-detail";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { InvoiceSummaryCard } from "@/app/dashboard/(pages)/notas/(pages)/[id]/components/invoice-summary-card";
import { InvoiceActionsCard } from "@/app/dashboard/(pages)/notas/(pages)/[id]/components/invoice-actions-card";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const detail = await getInvoiceDetail(id);
  if (!detail) notFound();
  const { invoice, subtotalCents, whatsappLink } = detail;

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
        <InvoiceSummaryCard invoice={invoice} subtotalCents={subtotalCents} />
        <InvoiceActionsCard invoice={invoice} whatsappLink={whatsappLink} />
      </div>
    </div>
  );
}
