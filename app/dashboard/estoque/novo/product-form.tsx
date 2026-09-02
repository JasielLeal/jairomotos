"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { createProduct } from "@/lib/actions/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { Field, CurrencyInput, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductForm() {
  const [state, action, pending] = useActionState(createProduct, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <ImageUpload name="imageData" />

      <Field label="Nome" htmlFor="name" error={state?.errors?.name} required>
        <Input id="name" name="name" placeholder="Ex: Pastilha de Freio Traseira" required />
      </Field>

      <Field label="Categoria" htmlFor="category" error={state?.errors?.category} required>
        <Select
          name="category"
          defaultValue="Outros"
          required
          items={PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c }))}
        >
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Custo (R$)" htmlFor="costCents" error={state?.errors?.costCents} required>
          <CurrencyInput id="costCents" name="costCents" required />
        </Field>
        <Field label="Preço de venda (R$)" htmlFor="priceCents" error={state?.errors?.priceCents} required>
          <CurrencyInput id="priceCents" name="priceCents" required />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Quantidade inicial" htmlFor="quantity" error={state?.errors?.quantity} required>
          <Input id="quantity" name="quantity" type="number" min="0" defaultValue="0" required />
        </Field>
        <Field label="Estoque mínimo" htmlFor="minStock" error={state?.errors?.minStock} required>
          <Input id="minStock" name="minStock" type="number" min="0" defaultValue="0" required />
        </Field>
      </div>

      {state?.message && <FormMessage message={state.message} />}

      <div>
        <Button type="submit" disabled={pending} size="lg">
          <Save className="size-4" />
          {pending ? "Salvando..." : "Cadastrar produto"}
        </Button>
      </div>
    </form>
  );
}
