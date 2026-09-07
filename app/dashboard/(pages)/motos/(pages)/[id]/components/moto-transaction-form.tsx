"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { addMotoTransaction } from "@/app/dashboard/(pages)/motos/lib/actions";
import { CurrencyInput, Field, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MotoTransactionForm({ motorcycleId }: { motorcycleId: string }) {
  const action = addMotoTransaction.bind(null, motorcycleId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr_140px]">
        <Field label="Tipo" htmlFor="txType" error={state?.errors?.type} required>
          <Select
            name="type"
            defaultValue="DESPESA"
            required
            items={{ DESPESA: "Despesa", RECEITA: "Receita" }}
          >
            <SelectTrigger id="txType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESPESA">Despesa</SelectItem>
              <SelectItem value="RECEITA">Receita</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Categoria" htmlFor="txCategory" error={state?.errors?.category} required>
          <Input id="txCategory" name="category" placeholder="Ex: Manutenção, Documentação..." required />
        </Field>

        <Field label="Valor (R$)" htmlFor="txAmountCents" error={state?.errors?.amountCents} required>
          <CurrencyInput id="txAmountCents" name="amountCents" required />
        </Field>
      </div>

      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto]">
        <Field label="Descrição" htmlFor="txDescription" error={state?.errors?.description} required>
          <Input
            id="txDescription"
            name="description"
            placeholder="Ex: Revisão antes da venda"
            required
          />
        </Field>

        <Button type="submit" disabled={pending} size="lg">
          <Plus className="size-4" />
          {pending ? "Salvando..." : "Lançar"}
        </Button>
      </div>

      {state?.message && state.success && <FormMessage message={state.message} tone="success" />}
    </form>
  );
}
