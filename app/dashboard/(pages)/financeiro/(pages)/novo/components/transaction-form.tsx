"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { createTransaction } from "@/app/dashboard/(pages)/financeiro/lib/actions";
import { Field, CurrencyInput, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const today = new Date().toISOString().slice(0, 10);

export default function TransactionForm() {
  const [state, action, pending] = useActionState(createTransaction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Tipo" htmlFor="type" error={state?.errors?.type} required>
        <Select name="type" defaultValue="DESPESA" required items={{ RECEITA: "Receita", DESPESA: "Despesa" }}>
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RECEITA">Receita</SelectItem>
            <SelectItem value="DESPESA">Despesa</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Categoria" htmlFor="category" error={state?.errors?.category} required>
        <Input id="category" name="category" placeholder="Ex: Aluguel, Fornecedor, Salários" required />
      </Field>

      <Field label="Descrição" htmlFor="description" error={state?.errors?.description} required>
        <Input id="description" name="description" required />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Valor (R$)" htmlFor="amountCents" error={state?.errors?.amountCents} required>
          <CurrencyInput id="amountCents" name="amountCents" required />
        </Field>
        <Field label="Data" htmlFor="date" error={state?.errors?.date} required>
          <Input id="date" name="date" type="date" defaultValue={today} required />
        </Field>
      </div>

      <Field label="Forma de pagamento (opcional)" htmlFor="method" error={state?.errors?.method}>
        <Input id="method" name="method" placeholder="Ex: Pix, Dinheiro, Cartão" />
      </Field>

      {state?.message && <FormMessage message={state.message} tone="success" />}

      <div>
        <Button type="submit" disabled={pending} size="lg">
          <Save className="size-4" />
          {pending ? "Salvando..." : "Registrar lançamento"}
        </Button>
      </div>
    </form>
  );
}
