import { describe, expect, it } from "vitest";
import { BoletoSchema } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/validations";

describe("BoletoSchema", () => {
  const validBoleto = {
    description: "Boleto fornecedor de peças",
    type: "DESPESA",
    amountCents: "15000",
    dueDate: "2026-10-10",
  };

  it("accepts a valid boleto", () => {
    const result = BoletoSchema.safeParse(validBoleto);
    expect(result.success).toBe(true);
  });

  it("rejects an empty description", () => {
    const result = BoletoSchema.safeParse({ ...validBoleto, description: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a type outside RECEITA/DESPESA", () => {
    const result = BoletoSchema.safeParse({ ...validBoleto, type: "INVALIDO" });
    expect(result.success).toBe(false);
  });

  it("rejects an amount below 1", () => {
    const result = BoletoSchema.safeParse({ ...validBoleto, amountCents: "0" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing due date", () => {
    const result = BoletoSchema.safeParse({ ...validBoleto, dueDate: "" });
    expect(result.success).toBe(false);
  });

  it("accepts optional notes", () => {
    const result = BoletoSchema.safeParse({ ...validBoleto, notes: "Pago via pix" });
    expect(result.success).toBe(true);
  });
});
