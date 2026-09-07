"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { createMotorcycle } from "@/app/dashboard/(pages)/motos/lib/actions";
import { Field, CurrencyInput, FormMessage } from "@/components/ui/form";
import { MultiImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function MotorcycleForm() {
  const [state, action, pending] = useActionState(createMotorcycle, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <MultiImageUpload name="images" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Marca" htmlFor="brand" error={state?.errors?.brand} required>
          <Input id="brand" name="brand" placeholder="Ex: Honda" required />
        </Field>
        <Field label="Modelo" htmlFor="model" error={state?.errors?.model} required>
          <Input id="model" name="model" placeholder="Ex: CG 160 Fan" required />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Ano" htmlFor="year" error={state?.errors?.year} required>
          <Input
            id="year"
            name="year"
            type="number"
            defaultValue={new Date().getFullYear()}
            required
          />
        </Field>
        <Field label="Cor" htmlFor="color" error={state?.errors?.color}>
          <Input id="color" name="color" placeholder="Ex: Preta" />
        </Field>
        <Field label="Placa" htmlFor="plate" error={state?.errors?.plate}>
          <Input id="plate" name="plate" placeholder="Ex: ABC1D23" />
        </Field>
      </div>

      <Field label="Quilometragem" htmlFor="mileage" error={state?.errors?.mileage} required>
        <Input id="mileage" name="mileage" type="number" min="0" defaultValue="0" required />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Custo de aquisição (R$)"
          htmlFor="purchaseCostCents"
          error={state?.errors?.purchaseCostCents}
          required
        >
          <CurrencyInput id="purchaseCostCents" name="purchaseCostCents" required />
        </Field>
        <Field
          label="Preço de venda (R$)"
          htmlFor="salePriceCents"
          error={state?.errors?.salePriceCents}
          required
        >
          <CurrencyInput id="salePriceCents" name="salePriceCents" required />
        </Field>
      </div>

      <Field label="Descrição" htmlFor="description" error={state?.errors?.description}>
        <Textarea
          id="description"
          name="description"
          placeholder="Detalhes que aparecem na vitrine pública (opcional)"
        />
      </Field>

      {state?.message && <FormMessage message={state.message} />}

      <div>
        <Button type="submit" disabled={pending} size="lg">
          <Save className="size-4" />
          {pending ? "Salvando..." : "Cadastrar moto"}
        </Button>
      </div>
    </form>
  );
}
