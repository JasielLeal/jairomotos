"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { syncImages, deleteImage } from "@/lib/cloudinary";
import { MAX_IMAGES } from "@/lib/validations/image";
import {
  MotorcycleSchema,
  MotorcycleFormState,
  SellMotorcycleSchema,
  MotoTransactionEntrySchema,
  MotoActionState,
} from "@/app/dashboard/(pages)/motos/lib/validations";

export async function createMotorcycle(
  _state: MotorcycleFormState,
  formData: FormData
): Promise<MotorcycleFormState> {
  const session = await verifySession();

  const validated = MotorcycleSchema.safeParse({
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    color: formData.get("color") || undefined,
    plate: formData.get("plate") || undefined,
    mileage: formData.get("mileage"),
    purchaseCostCents: formData.get("purchaseCostCents"),
    salePriceCents: formData.get("salePriceCents"),
    description: formData.get("description") || undefined,
    images: formData.getAll("images"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  let images: string[];
  try {
    images = await syncImages({ previous: [], incoming: validated.data.images, folder: "motorcycles" });
  } catch (error) {
    console.error("createMotorcycle:images", error);
    return { message: "Erro ao enviar as fotos. Tente novamente." };
  }

  const { purchaseCostCents, ...data } = validated.data;

  const motorcycle = await db.$transaction(async (tx) => {
    const created = await tx.motorcycle.create({ data: { ...data, images, purchaseCostCents } });

    if (purchaseCostCents > 0) {
      await tx.motoTransaction.create({
        data: {
          type: "DESPESA",
          category: "Compra",
          description: `Compra - ${created.brand} ${created.model} (${created.year})`,
          amountCents: purchaseCostCents,
          motorcycleId: created.id,
          createdById: session.userId,
        },
      });
    }

    return created;
  });

  revalidatePath("/dashboard/motos");
  revalidatePath("/dashboard/motos/financeiro");
  revalidatePath("/");
  redirect(`/dashboard/motos/${motorcycle.id}`);
}

export async function updateMotorcycle(
  motorcycleId: string,
  _state: MotorcycleFormState,
  formData: FormData
): Promise<MotorcycleFormState> {
  await verifySession();

  const validated = MotorcycleSchema.omit({ purchaseCostCents: true, images: true }).safeParse({
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    color: formData.get("color") || undefined,
    plate: formData.get("plate") || undefined,
    mileage: formData.get("mileage"),
    salePriceCents: formData.get("salePriceCents"),
    description: formData.get("description") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await db.motorcycle.update({ where: { id: motorcycleId }, data: validated.data });

  revalidatePath("/dashboard/motos");
  revalidatePath(`/dashboard/motos/${motorcycleId}`);
  revalidatePath("/");
  return { message: "Moto atualizada com sucesso." };
}

export async function updateMotorcycleImages(
  motorcycleId: string,
  _state: MotorcycleFormState,
  formData: FormData
): Promise<MotorcycleFormState> {
  await verifySession();

  const incoming = formData
    .getAll("images")
    .filter((v): v is string => typeof v === "string")
    .slice(0, MAX_IMAGES);

  const motorcycle = await db.motorcycle.findUnique({
    where: { id: motorcycleId },
    select: { images: true },
  });
  if (!motorcycle) {
    return { message: "Moto não encontrada." };
  }

  let images: string[];
  try {
    images = await syncImages({ previous: motorcycle.images, incoming, folder: "motorcycles" });
  } catch (error) {
    console.error("updateMotorcycleImages:images", error);
    return { message: "Erro ao enviar as fotos. Tente novamente." };
  }

  await db.motorcycle.update({ where: { id: motorcycleId }, data: { images } });

  revalidatePath("/dashboard/motos");
  revalidatePath(`/dashboard/motos/${motorcycleId}`);
  revalidatePath("/");
  return { message: "Fotos atualizadas com sucesso." };
}

export async function setMotorcycleStatus(motorcycleId: string, status: "AVAILABLE" | "RESERVED") {
  await verifySession();

  await db.motorcycle.update({ where: { id: motorcycleId }, data: { status } });

  revalidatePath("/dashboard/motos");
  revalidatePath(`/dashboard/motos/${motorcycleId}`);
  revalidatePath("/");
}

export async function sellMotorcycle(
  motorcycleId: string,
  _state: MotoActionState,
  formData: FormData
): Promise<MotoActionState> {
  const session = await verifySession();

  const validated = SellMotorcycleSchema.safeParse({
    soldPriceCents: formData.get("soldPriceCents"),
    buyerName: formData.get("buyerName"),
    buyerPhone: formData.get("buyerPhone") || undefined,
    saleProofImages: formData.getAll("saleProofImages"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  let saleProofImages: string[];
  try {
    saleProofImages = await syncImages({
      previous: [],
      incoming: validated.data.saleProofImages,
      folder: "motorcycles/sale-proof",
    });
  } catch (error) {
    console.error("sellMotorcycle:images", error);
    return { message: "Erro ao enviar as fotos do comprovante. Tente novamente." };
  }

  try {
    await db.$transaction(async (tx) => {
      const motorcycle = await tx.motorcycle.findUnique({ where: { id: motorcycleId } });
      if (!motorcycle) throw new Error("Moto não encontrada.");
      if (motorcycle.status === "SOLD") throw new Error("Esta moto já foi vendida.");

      await tx.motorcycle.update({
        where: { id: motorcycleId },
        data: {
          status: "SOLD",
          soldPriceCents: validated.data.soldPriceCents,
          buyerName: validated.data.buyerName,
          buyerPhone: validated.data.buyerPhone || null,
          saleProofImages,
          soldAt: new Date(),
        },
      });

      await tx.motoTransaction.create({
        data: {
          type: "RECEITA",
          category: "Venda",
          description: `Venda - ${motorcycle.brand} ${motorcycle.model} (${motorcycle.year}) para ${validated.data.buyerName}`,
          amountCents: validated.data.soldPriceCents,
          motorcycleId,
          createdById: session.userId,
        },
      });
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao registrar a venda.",
    };
  }

  revalidatePath("/dashboard/motos");
  revalidatePath(`/dashboard/motos/${motorcycleId}`);
  revalidatePath("/dashboard/motos/financeiro");
  revalidatePath("/");
  return { success: true, message: "Venda registrada com sucesso." };
}

export async function addMotoTransaction(
  motorcycleId: string,
  _state: MotoActionState,
  formData: FormData
): Promise<MotoActionState> {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return { success: false, message: "Apenas administradores podem lançar movimentações financeiras." };
  }

  const validated = MotoTransactionEntrySchema.safeParse({
    type: formData.get("type"),
    category: formData.get("category"),
    description: formData.get("description"),
    amountCents: formData.get("amountCents"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await db.motoTransaction.create({
    data: { ...validated.data, motorcycleId, createdById: session.userId },
  });

  revalidatePath(`/dashboard/motos/${motorcycleId}`);
  revalidatePath("/dashboard/motos/financeiro");
  return { success: true, message: "Lançamento registrado com sucesso." };
}

export async function deleteMotorcycle(motorcycleId: string) {
  await verifySession();

  try {
    const motorcycle = await db.motorcycle.findUnique({
      where: { id: motorcycleId },
      select: { images: true, saleProofImages: true },
    });

    // MotoTransactions cascade-delete with the motorcycle.
    await db.motorcycle.delete({ where: { id: motorcycleId } });

    if (motorcycle) {
      await Promise.all(
        [...motorcycle.images, ...motorcycle.saleProofImages].map((url) => deleteImage(url))
      );
    }
  } catch {
    return { success: false, message: "Erro ao excluir a moto." };
  }

  revalidatePath("/dashboard/motos");
  revalidatePath("/dashboard/motos/financeiro");
  revalidatePath("/");
  redirect("/dashboard/motos");
}
