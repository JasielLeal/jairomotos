"use client";

import { useActionState } from "react";
import type { Product } from "@prisma/client";
import { Save } from "lucide-react";
import { updateProduct } from "@/lib/actions/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
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

export default function EditProductForm({ product }: { product: Product }) {
  const action = updateProduct.bind(null, product.id);
  const [state, formAction, pending] = useActionState(action, undefined);

  const initialCategory = PRODUCT_CATEGORIES.includes(product.category as never)
    ? product.category!
    : "Outros";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Nome" htmlFor="name" error={state?.errors?.name} required>
        <Input id="name" name="name" defaultValue={product.name} required />
      </Field>

      <Field label="Categoria" htmlFor="category" error={state?.errors?.category} required>
        <Select
          name="category"
          defaultValue={initialCategory}
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
          <CurrencyInput id="costCents" name="costCents" defaultValueCents={product.costCents} required />
        </Field>
        <Field label="Preço de venda (R$)" htmlFor="priceCents" error={state?.errors?.priceCents} required>
          <CurrencyInput id="priceCents" name="priceCents" defaultValueCents={product.priceCents} required />
        </Field>
      </div>

      <Field label="Estoque mínimo" htmlFor="minStock" error={state?.errors?.minStock} required>
        <Input
          id="minStock"
          name="minStock"
          type="number"
          min="0"
          defaultValue={product.minStock}
          required
        />
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
