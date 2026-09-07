import "server-only";
import { db } from "@/lib/db";
import { buildInvoiceMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export async function getInvoiceDetail(id: string) {
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      createdBy: { select: { name: true } },
      items: { include: { product: { select: { name: true, unit: true, sku: true } } } },
      services: true,
    },
  });

  if (!invoice) return null;

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

  return { invoice, subtotalCents, whatsappLink };
}
