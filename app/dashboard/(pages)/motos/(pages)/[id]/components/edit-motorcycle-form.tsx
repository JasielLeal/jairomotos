"use client";

import { useActionState } from "react";
import type { Motorcycle } from "@prisma/client";
import { Save } from "lucide-react";
import { updateMotorcycle } from "@/app/dashboard/(pages)/motos/lib/actions";
import { Field, CurrencyInput, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditMotorcycleForm({ motorcycle }: { motorcycle: Motorcycle }) {
  const action = updateMotorcycle.bind(null, motorcycle.id);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Marca" htmlFor="brand" error={state?.errors?.brand} required>
          <Input id="brand" name="brand" defaultValue={motorcycle.brand} required />
        </Field>
        <Field label="Modelo" htmlFor="model" error={state?.errors?.model} required>
          <Input id="model" name="model" defaultValue={motorcycle.model} required />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Ano" htmlFor="year" error={state?.errors?.year} required>
          <Input id="year" name="year" type="number" defaultValue={motorcycle.year} required />
        </Field>
        <Field label="Cor" htmlFor="color" error={state?.errors?.color}>
          <Input id="color" name="color" defaultValue={motorcycle.color ?? ""} />
        </Field>
        <Field label="Placa" htmlFor="plate" error={state?.errors?.plate}>
          <Input id="plate" name="plate" defaultValue={motorcycle.plate ?? ""} />
        </Field>
      </div>

      <Field label="Quilometragem" htmlFor="mileage" error={state?.errors?.mileage} required>
        <Input
          id="mileage"
          name="mileage"
          type="number"
          min="0"
          defaultValue={motorcycle.mileage}
          required
        />
      </Field>

      <Field
        label="Preço de venda (R$)"
        htmlFor="salePriceCents"
        error={state?.errors?.salePriceCents}
        required
      >
        <CurrencyInput
          id="salePriceCents"
          name="salePriceCents"
          defaultValueCents={motorcycle.salePriceCents}
          required
        />
      </Field>

      <Field label="Descrição" htmlFor="description" error={state?.errors?.description}>
        <Textarea id="description" name="description" defaultValue={motorcycle.description ?? ""} />
      </Field>

      {state?.message && <FormMessage message={state.message} tone="success" />}

      <div>
        <Button type="submit" disabled={pending} size="lg">
          <Save className="size-4" />
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
