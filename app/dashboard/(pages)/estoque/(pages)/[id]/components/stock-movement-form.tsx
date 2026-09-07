"use client";

import { useActionState } from "react";
import { PackagePlus } from "lucide-react";
import { registerStockMovement } from "@/app/dashboard/(pages)/estoque/lib/actions";
import { Field, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StockMovementForm({ productId }: { productId: string }) {
  const [state, action, pending] = useActionState(registerStockMovement, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="productId" value={productId} />

      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[200px_120px_1fr_auto]">
        <Field label="Tipo" htmlFor="type" error={state?.errors?.type} required>
          <Select
            name="type"
            defaultValue="ENTRADA"
            required
            items={{ ENTRADA: "Entrada (compra/reposição)", SAIDA: "Saída (uso interno/perda)" }}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENTRADA">Entrada (compra/reposição)</SelectItem>
              <SelectItem value="SAIDA">Saída (uso interno/perda)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Quantidade" htmlFor="quantity" error={state?.errors?.quantity} required>
          <Input id="quantity" name="quantity" type="number" min="1" required />
        </Field>

        <Field label="Motivo (opcional)" htmlFor="reason" error={state?.errors?.reason}>
          <Input id="reason" name="reason" placeholder="Ex: Compra fornecedor X" />
        </Field>

        <Button type="submit" disabled={pending} size="lg">
          <PackagePlus className="size-4" />
          {pending ? "Registrando..." : "Registrar"}
        </Button>
      </div>

      {state?.message && <FormMessage message={state.message} tone="success" />}
    </form>
  );
}
