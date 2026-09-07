import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import InvoiceForm from "@/app/dashboard/(pages)/notas/components/invoice-form";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { include: { product: { select: { name: true, unit: true, images: true } } } },
      services: true,
    },
  });

  if (!invoice) notFound();
  if (invoice.status !== "PENDING") redirect(`/dashboard/notas/${id}`);

  const products = await db.product.findMany({
    where: { active: true, quantity: { gt: 0 } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, priceCents: true, quantity: true, unit: true, images: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Editar nota #${invoice.number}`}
        description="Altere os itens, serviços ou o desconto enquanto a nota estiver pendente."
      />
      <Card className="max-w-3xl">
        <CardContent>
          <InvoiceForm
            products={products}
            invoice={{
              id: invoice.id,
              customerName: invoice.customer.name,
              customerPhone: invoice.customer.phone,
              notes: invoice.notes,
              discountCents: invoice.discountCents,
              items: invoice.items.map((item) => ({
                productId: item.productId,
                productName: item.product.name,
                productImage: item.product.images[0] ?? null,
                unit: item.product.unit,
                quantity: item.quantity,
                unitPriceCents: item.unitPriceCents,
              })),
              services: invoice.services.map((service) => ({
                description: service.description,
                amountCents: service.amountCents,
              })),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
