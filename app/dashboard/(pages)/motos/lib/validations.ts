import * as z from "zod";
import { imagesArraySchema } from "@/lib/validations/image";

export const MotorcycleSchema = z.object({
  brand: z.string().min(2, { error: "Marca muito curta." }).trim(),
  model: z.string().min(1, { error: "Informe o modelo." }).trim(),
  year: z.coerce
    .number()
    .int()
    .min(1950, { error: "Ano inválido." })
    .max(new Date().getFullYear() + 1, { error: "Ano inválido." }),
  color: z.string().trim().optional(),
  plate: z.string().trim().optional(),
  mileage: z.coerce.number().int().min(0, { error: "Quilometragem inválida." }),
  purchaseCostCents: z.coerce.number().int().min(0, { error: "Custo inválido." }),
  salePriceCents: z.coerce.number().int().min(1, { error: "Preço inválido." }),
  description: z.string().trim().optional(),
  images: imagesArraySchema().optional().default([]),
});

export type MotorcycleFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export const SellMotorcycleSchema = z.object({
  soldPriceCents: z.coerce.number().int().min(1, { error: "Preço de venda inválido." }),
  buyerName: z.string().trim().min(2, { error: "Informe o nome do comprador." }),
  buyerPhone: z.string().trim().optional(),
  saleProofImages: imagesArraySchema(1),
});

export const MotoTransactionEntrySchema = z.object({
  type: z.enum(["RECEITA", "DESPESA"], { error: "Selecione o tipo." }),
  category: z.string().trim().min(1, { error: "Informe a categoria." }),
  description: z.string().trim().min(1, { error: "Descreva o lançamento." }),
  amountCents: z.coerce.number().int().min(1, { error: "Valor inválido." }),
});

export type MotoActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;
