"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { TransactionSchema, TransactionFormState } from "@/lib/validations/finance";

export async function createTransaction(
  _state: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const session = await verifySession();

  const validated = TransactionSchema.safeParse({
    type: formData.get("type"),
    category: formData.get("category"),
    description: formData.get("description"),
    amountCents: formData.get("amountCents"),
    method: formData.get("method") || undefined,
    date: formData.get("date"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { type, category, description, amountCents, method, date } = validated.data;

  await db.financialTransaction.create({
    data: {
      type,
      category,
      description,
      amountCents,
      method,
      date: new Date(date),
      status: "PAGO",
      createdById: session.userId,
    },
  });

  revalidatePath("/dashboard/financeiro");
  revalidatePath("/dashboard");
  return { message: "Lançamento registrado com sucesso." };
}
