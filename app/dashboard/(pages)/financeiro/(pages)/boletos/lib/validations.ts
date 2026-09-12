import * as z from "zod";

export const BoletoSchema = z.object({
  description: z.string().trim().min(1, { error: "Informe uma descrição." }),
  type: z.enum(["RECEITA", "DESPESA"], { error: "Selecione o tipo." }),
  amountCents: z.coerce.number().int().min(1, { error: "Valor inválido." }),
  dueDate: z.string().trim().min(1, { error: "Informe o vencimento." }),
  notes: z.string().trim().optional(),
});

export type BoletoFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;
