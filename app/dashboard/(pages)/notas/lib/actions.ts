"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import {
  CreateInvoiceSchema,
  UpdateInvoiceSchema,
  InvoiceFormState,
} from "@/app/dashboard/(pages)/notas/lib/validations";

export async function createInvoice(
  _state: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const session = await verifySession();

  const productIds = formData.getAll("productId");
  const quantities = formData.getAll("quantity");
  const unitPrices = formData.getAll("unitPriceCents");

  const items = productIds.map((productId, i) => ({
    productId,
    quantity: quantities[i],
    unitPriceCents: unitPrices[i],
  }));

  const serviceDescriptions = formData.getAll("serviceDescription");
  const serviceAmounts = formData.getAll("serviceAmountCents");

  const services = serviceDescriptions.map((description, i) => ({
    description,
    amountCents: serviceAmounts[i],
  }));

  const validated = CreateInvoiceSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone") || undefined,
    notes: formData.get("notes") || undefined,
    discountCents: formData.get("discountCents") || 0,
    items,
    services,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const {
    customerName,
    customerPhone,
    notes,
    discountCents,
    items: validItems,
    services: validServices,
  } = validated.data;

  if (validItems.length === 0 && validServices.length === 0) {
    return { message: "Adicione ao menos um item ou serviço." };
  }

  const products = await db.product.findMany({
    where: { id: { in: validItems.map((i) => i.productId) } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of validItems) {
    if (!productMap.has(item.productId)) {
      return { message: "Um dos produtos selecionados não existe mais." };
    }
  }

  const itemsWithSubtotal = validItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    subtotalCents: item.quantity * item.unitPriceCents,
  }));
  const itemsTotal = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotalCents, 0);
  const servicesTotal = validServices.reduce((sum, s) => sum + s.amountCents, 0);
  const subtotalCents = itemsTotal + servicesTotal;

  if (discountCents > subtotalCents) {
    return { errors: { discount: ["O desconto não pode ser maior que o subtotal."] } };
  }

  const totalCents = subtotalCents - discountCents;

  // Reuse an existing customer with the same phone (so repeat clients don't
  // pile up as duplicates), otherwise register a new one from the typed info.
  const existingCustomer = customerPhone
    ? await db.customer.findFirst({ where: { phone: customerPhone } })
    : null;
  const customer =
    existingCustomer ??
    (await db.customer.create({ data: { name: customerName, phone: customerPhone } }));

  const invoice = await db.invoice.create({
    data: {
      customerId: customer.id,
      notes,
      discountCents,
      totalCents,
      createdById: session.userId,
      items: { create: itemsWithSubtotal },
      services: { create: validServices },
    },
  });

  revalidatePath("/dashboard/notas");
  redirect(`/dashboard/notas/${invoice.id}`);
}

export async function updateInvoice(
  invoiceId: string,
  _state: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  await verifySession();

  const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) {
    return { message: "Nota não encontrada." };
  }
  if (invoice.status !== "PENDING") {
    return { message: "Só é possível editar notas pendentes." };
  }

  const productIds = formData.getAll("productId");
  const quantities = formData.getAll("quantity");
  const unitPrices = formData.getAll("unitPriceCents");

  const items = productIds.map((productId, i) => ({
    productId,
    quantity: quantities[i],
    unitPriceCents: unitPrices[i],
  }));

  const serviceDescriptions = formData.getAll("serviceDescription");
  const serviceAmounts = formData.getAll("serviceAmountCents");

  const services = serviceDescriptions.map((description, i) => ({
    description,
    amountCents: serviceAmounts[i],
  }));

  const validated = UpdateInvoiceSchema.safeParse({
    notes: formData.get("notes") || undefined,
    discountCents: formData.get("discountCents") || 0,
    items,
    services,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { notes, discountCents, items: validItems, services: validServices } = validated.data;

  if (validItems.length === 0 && validServices.length === 0) {
    return { message: "Adicione ao menos um item ou serviço." };
  }

  const products = await db.product.findMany({
    where: { id: { in: validItems.map((i) => i.productId) } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of validItems) {
    if (!productMap.has(item.productId)) {
      return { message: "Um dos produtos selecionados não existe mais." };
    }
  }

  const itemsWithSubtotal = validItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    subtotalCents: item.quantity * item.unitPriceCents,
  }));
  const itemsTotal = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotalCents, 0);
  const servicesTotal = validServices.reduce((sum, s) => sum + s.amountCents, 0);
  const subtotalCents = itemsTotal + servicesTotal;

  if (discountCents > subtotalCents) {
    return { errors: { discount: ["O desconto não pode ser maior que o subtotal."] } };
  }

  const totalCents = subtotalCents - discountCents;

  await db.$transaction(async (tx) => {
    await tx.invoiceItem.deleteMany({ where: { invoiceId } });
    await tx.invoiceService.deleteMany({ where: { invoiceId } });
    await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        notes,
        discountCents,
        totalCents,
        items: { create: itemsWithSubtotal },
        services: { create: validServices },
      },
    });
  });

  revalidatePath("/dashboard/notas");
  revalidatePath(`/dashboard/notas/${invoiceId}`);
  redirect(`/dashboard/notas/${invoiceId}`);
}

export async function approveInvoice(invoiceId: string) {
  const session = await verifySession();

  try {
    await db.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        include: { items: { include: { product: true } } },
      });

      if (!invoice) throw new Error("Nota não encontrada.");
      if (invoice.status !== "PENDING") {
        throw new Error("Esta nota já foi aprovada ou cancelada.");
      }

      for (const item of invoice.items) {
        if (item.product.quantity < item.quantity) {
          throw new Error(
            `Estoque insuficiente para "${item.product.name}": há apenas ${item.product.quantity} unidade(s).`
          );
        }
      }

      for (const item of invoice.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "SAIDA",
            quantity: item.quantity,
            reason: `Venda - Nota #${invoice.number}`,
            invoiceId: invoice.id,
            userId: session.userId,
          },
        });
      }

      await tx.financialTransaction.create({
        data: {
          type: "RECEITA",
          category: "Venda",
          description: `Nota #${invoice.number}`,
          amountCents: invoice.totalCents,
          status: "PAGO",
          invoiceId: invoice.id,
          createdById: session.userId,
        },
      });

      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: "APPROVED", approvedAt: new Date() },
      });
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao aprovar a nota.",
    };
  }

  revalidatePath("/dashboard/notas");
  revalidatePath(`/dashboard/notas/${invoiceId}`);
  revalidatePath("/dashboard/estoque");
  revalidatePath("/dashboard/financeiro");
  revalidatePath("/dashboard");
  return { success: true, message: "Nota aprovada. Estoque e financeiro atualizados." };
}

export async function deleteInvoice(invoiceId: string) {
  const session = await verifySession();

  try {
    await db.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        include: { items: true },
      });

      if (!invoice) throw new Error("Nota não encontrada.");

      if (invoice.status === "APPROVED") {
        for (const item of invoice.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              type: "AJUSTE",
              quantity: item.quantity,
              reason: `Estorno - Nota #${invoice.number} excluída`,
              userId: session.userId,
            },
          });
        }

        await tx.financialTransaction.deleteMany({ where: { invoiceId: invoice.id } });
      }

      // InvoiceItem/InvoiceService cascade-delete with the invoice.
      // Past StockMovements that reference this invoice keep their record,
      // losing only the direct link (invoiceId is set to null).
      await tx.invoice.delete({ where: { id: invoiceId } });
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao excluir a nota.",
    };
  }

  revalidatePath("/dashboard/notas");
  revalidatePath("/dashboard/estoque");
  revalidatePath("/dashboard/financeiro");
  revalidatePath("/dashboard");
  redirect("/dashboard/notas");
}
