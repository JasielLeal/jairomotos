"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { BoletoSchema, BoletoFormState } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/validations";

export async function createBoleto(
  _state: BoletoFormState,
  formData: FormData
): Promise<BoletoFormState> {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return { message: "Apenas administradores podem cadastrar boletos." };
  }

  const validated = BoletoSchema.safeParse({
    description: formData.get("description"),
    type: formData.get("type"),
    amountCents: formData.get("amountCents"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { description, type, amountCents, dueDate, notes } = validated.data;

  await db.boleto.create({
    data: {
      description,
      type,
      amountCents,
      dueDate: new Date(dueDate),
      notes,
      createdById: session.userId,
    },
  });

  revalidatePath("/dashboard/financeiro/boletos");
  revalidatePath("/dashboard/financeiro");
  revalidatePath("/dashboard");
  redirect("/dashboard/financeiro/boletos");
}

export async function markBoletoPaid(boletoId: string) {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return { success: false, message: "Apenas administradores podem baixar boletos." };
  }

  let invoiceId: string | null = null;

  try {
    await db.$transaction(async (tx) => {
      const boleto = await tx.boleto.findUnique({ where: { id: boletoId } });
      if (!boleto) throw new Error("Boleto não encontrado.");
      if (boleto.status !== "PENDENTE") {
        throw new Error("Este boleto já foi baixado ou cancelado.");
      }

      const transaction = await tx.financialTransaction.create({
        data: {
          type: boleto.type,
          category: "Boleto",
          description: boleto.description,
          amountCents: boleto.amountCents,
          status: "PAGO",
          invoiceId: boleto.invoiceId,
          createdById: session.userId,
        },
      });

      await tx.boleto.update({
        where: { id: boletoId },
        data: { status: "PAGO", paidAt: new Date(), financialTransactionId: transaction.id },
      });

      if (boleto.invoiceId) {
        invoiceId = boleto.invoiceId;
        const invoice = await tx.invoice.findUnique({ where: { id: boleto.invoiceId } });
        if (invoice?.status === "PARTIAL") {
          await tx.invoice.update({
            where: { id: boleto.invoiceId },
            data: { status: "APPROVED", paidCents: invoice.totalCents },
          });
        }
      }
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao baixar o boleto.",
    };
  }

  revalidatePath("/dashboard/financeiro/boletos");
  revalidatePath("/dashboard/financeiro");
  revalidatePath("/dashboard/notas");
  if (invoiceId) revalidatePath(`/dashboard/notas/${invoiceId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Boleto baixado. Lançamento criado no financeiro." };
}

export async function cancelBoleto(boletoId: string) {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return { success: false, message: "Apenas administradores podem cancelar boletos." };
  }

  try {
    const boleto = await db.boleto.findUnique({ where: { id: boletoId } });
    if (!boleto) throw new Error("Boleto não encontrado.");
    if (boleto.status !== "PENDENTE") {
      throw new Error("Só é possível cancelar boletos pendentes.");
    }

    await db.boleto.update({ where: { id: boletoId }, data: { status: "CANCELADO" } });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao cancelar o boleto.",
    };
  }

  revalidatePath("/dashboard/financeiro/boletos");
  revalidatePath("/dashboard/notas");
  revalidatePath("/dashboard");
  return { success: true, message: "Boleto cancelado." };
}

export async function deleteBoleto(boletoId: string) {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return { success: false, message: "Apenas administradores podem excluir boletos." };
  }

  try {
    await db.$transaction(async (tx) => {
      const boleto = await tx.boleto.findUnique({ where: { id: boletoId } });
      if (!boleto) throw new Error("Boleto não encontrado.");

      if (boleto.financialTransactionId) {
        await tx.financialTransaction.delete({ where: { id: boleto.financialTransactionId } });
      }

      await tx.boleto.delete({ where: { id: boletoId } });
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao excluir o boleto.",
    };
  }

  revalidatePath("/dashboard/financeiro/boletos");
  revalidatePath("/dashboard/financeiro");
  revalidatePath("/dashboard/notas");
  revalidatePath("/dashboard");
  return { success: true, message: "Boleto excluído." };
}
