"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import {
  ProductSchema,
  ProductFormState,
  StockEntrySchema,
  StockEntryState,
} from "@/app/dashboard/(pages)/estoque/lib/validations";

function generateSku() {
  return `P-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function createProduct(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await verifySession();
  const isAdmin = session.role === "ADMIN";

  const validated = ProductSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    images: formData.getAll("images"),
    // Só administradores definem custo — funcionários não veem nem editam
    // essa informação, então o valor enviado por eles (se houver) é ignorado.
    costCents: isAdmin ? formData.get("costCents") : "0",
    priceCents: formData.get("priceCents"),
    quantity: formData.get("quantity"),
    minStock: formData.get("minStock"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = { ...validated.data, sku: generateSku(), unit: "un" };

  const product = await db.$transaction(async (tx) => {
    const created = await tx.product.create({ data });

    if (data.quantity > 0) {
      await tx.stockMovement.create({
        data: {
          productId: created.id,
          type: "ENTRADA",
          quantity: data.quantity,
          reason: "Estoque inicial",
          userId: session.userId,
        },
      });
    }

    return created;
  });

  revalidatePath("/dashboard/estoque");
  redirect(`/dashboard/estoque/${product.id}`);
}

export async function updateProduct(
  productId: string,
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await verifySession();
  const isAdmin = session.role === "ADMIN";

  // Funcionários não podem ver nem alterar o custo, então o campo é omitido
  // por completo da validação — o valor atual no banco fica intocado.
  const schema = isAdmin
    ? ProductSchema.omit({ quantity: true, images: true })
    : ProductSchema.omit({ quantity: true, images: true, costCents: true });

  const validated = schema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    ...(isAdmin ? { costCents: formData.get("costCents") } : {}),
    priceCents: formData.get("priceCents"),
    minStock: formData.get("minStock"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await db.product.update({
    where: { id: productId },
    data: validated.data,
  });

  revalidatePath("/dashboard/estoque");
  revalidatePath(`/dashboard/estoque/${productId}`);
  return { message: "Produto atualizado com sucesso." };
}

export async function updateProductImages(
  productId: string,
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifySession();

  const images = formData
    .getAll("images")
    .filter((v): v is string => typeof v === "string" && v.startsWith("data:image/"))
    .slice(0, 5);

  await db.product.update({ where: { id: productId }, data: { images } });

  revalidatePath("/dashboard/estoque");
  revalidatePath(`/dashboard/estoque/${productId}`);
  return { message: "Fotos atualizadas com sucesso." };
}

export async function registerStockMovement(
  _state: StockEntryState,
  formData: FormData
): Promise<StockEntryState> {
  const session = await verifySession();

  const validated = StockEntrySchema.safeParse({
    productId: formData.get("productId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { productId, type, quantity, reason } = validated.data;

  if (type === "AJUSTE") {
    return { message: "Ajustes automáticos não podem ser lançados manualmente." };
  }

  try {
    await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produto não encontrado.");

      if (type === "SAIDA" && product.quantity < quantity) {
        throw new Error(
          `Estoque insuficiente: há apenas ${product.quantity} unidade(s) em estoque.`
        );
      }

      await tx.product.update({
        where: { id: productId },
        data: {
          quantity: {
            [type === "ENTRADA" ? "increment" : "decrement"]: quantity,
          },
        },
      });

      await tx.stockMovement.create({
        data: { productId, type, quantity, reason, userId: session.userId },
      });
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Erro ao registrar movimentação.",
    };
  }

  revalidatePath("/dashboard/estoque");
  revalidatePath(`/dashboard/estoque/${productId}`);
  return { message: "Movimentação registrada com sucesso." };
}
