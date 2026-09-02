import * as z from "zod";

export const TransactionSchema = z.object({
  type: z.enum(["RECEITA", "DESPESA"]),
  category: z.string().trim().min(1, { error: "Informe uma categoria." }),
  description: z.string().trim().min(1, { error: "Informe uma descrição." }),
  amountCents: z.coerce.number().int().min(1, { error: "Valor inválido." }),
  method: z.string().trim().optional(),
  date: z.string().trim().min(1, { error: "Informe a data." }),
});

export type TransactionFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;
