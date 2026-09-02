import * as z from "zod";

export const InvoiceItemInputSchema = z.object({
  productId: z.string().min(1, { error: "Selecione um produto." }),
  quantity: z.coerce.number().int().min(1, { error: "Quantidade inválida." }),
  unitPriceCents: z.coerce.number().int().min(0, { error: "Preço inválido." }),
});

export const InvoiceServiceInputSchema = z.object({
  description: z.string().trim().min(1, { error: "Descreva o serviço." }),
  amountCents: z.coerce.number().int().min(1, { error: "Valor inválido." }),
});

export const CreateInvoiceSchema = z.object({
  customerName: z.string().min(2, { error: "Informe o nome do cliente." }).trim(),
  customerPhone: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  discountCents: z.coerce.number().int().min(0, { error: "Desconto inválido." }).default(0),
  items: z.array(InvoiceItemInputSchema).default([]),
  services: z.array(InvoiceServiceInputSchema).default([]),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

export type InvoiceFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;
