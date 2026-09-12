import * as z from "zod";

export const ProductSchema = z.object({
  name: z.string().min(2, { error: "Nome muito curto." }).trim(),
  shelf: z.string().trim().min(1, { error: "Informe a prateleira." }),
  images: z
    .array(z.string().trim())
    .max(5, { error: "Máximo de 5 fotos." })
    .refine((arr) => arr.every((v) => v.startsWith("data:image/")), {
      error: "Uma das fotos é inválida.",
    })
    .optional()
    .default([]),
  costCents: z.coerce.number().int().min(0, { error: "Custo inválido." }),
  priceCents: z.coerce.number().int().min(1, { error: "Preço inválido." }),
  quantity: z.coerce.number().int().min(0, { error: "Quantidade inválida." }),
  minStock: z.coerce.number().int().min(0, { error: "Estoque mínimo inválido." }),
});

export type ProductFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export const StockEntrySchema = z.object({
  productId: z.string().min(1),
  type: z.enum(["ENTRADA", "SAIDA", "AJUSTE"]),
  quantity: z.coerce.number().int().min(1, { error: "Informe uma quantidade válida." }),
  reason: z.string().trim().optional(),
});

export type StockEntryState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;
