"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { createBoleto } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/actions";
import { Field, CurrencyInput, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BoletoForm() {
  const [state, action, pending] = useActionState(createBoleto, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Tipo" htmlFor="type" error={state?.errors?.type} required>
        <Select name="type" defaultValue="DESPESA" required items={{ RECEITA: "A receber", DESPESA: "A pagar" }}>
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RECEITA">A receber</SelectItem>
            <SelectItem value="DESPESA">A pagar</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Descrição" htmlFor="description" error={state?.errors?.description} required>
        <Input id="description" name="description" placeholder="Ex: Boleto fornecedor de peças" required />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Valor (R$)" htmlFor="amountCents" error={state?.errors?.amountCents} required>
          <CurrencyInput id="amountCents" name="amountCents" required />
        </Field>
        <Field label="Vencimento" htmlFor="dueDate" error={state?.errors?.dueDate} required>
          <Input id="dueDate" name="dueDate" type="date" required />
        </Field>
      </div>

      <Field label="Observações (opcional)" htmlFor="notes" error={state?.errors?.notes}>
        <Textarea id="notes" name="notes" rows={2} />
      </Field>

      {state?.message && <FormMessage message={state.message} />}

      <div>
        <Button type="submit" disabled={pending} size="lg">
          <Save className="size-4" />
          {pending ? "Salvando..." : "Cadastrar boleto"}
        </Button>
      </div>
    </form>
  );
}
