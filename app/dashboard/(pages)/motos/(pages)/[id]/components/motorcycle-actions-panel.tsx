"use client";

import { useActionState, useTransition } from "react";
import type { Motorcycle } from "@prisma/client";
import { DollarSign, Trash2 } from "lucide-react";
import { deleteMotorcycle, sellMotorcycle, setMotorcycleStatus } from "@/app/dashboard/(pages)/motos/lib/actions";
import { CurrencyInput, Field, FormMessage } from "@/components/ui/form";
import { MultiImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MotorcycleActionsPanel({ motorcycle }: { motorcycle: Motorcycle }) {
  const sellAction = sellMotorcycle.bind(null, motorcycle.id);
  const deleteAction = deleteMotorcycle.bind(null, motorcycle.id);

  const [sellState, sellFormAction, sellPending] = useActionState(sellAction, undefined);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAction, undefined);
  const [statusPending, startStatusTransition] = useTransition();

  function handleStatusChange(status: "AVAILABLE" | "RESERVED") {
    startStatusTransition(() => {
      setMotorcycleStatus(motorcycle.id, status);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {motorcycle.status !== "SOLD" && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                size="lg"
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <DollarSign className="size-4" />
                Marcar como vendida
              </Button>
            }
          />
          <AlertDialogContent>
            <form action={sellFormAction} className="contents">
              <AlertDialogHeader>
                <AlertDialogTitle>Registrar venda</AlertDialogTitle>
                <AlertDialogDescription>
                  Informe o valor, o comprador e anexe ao menos uma foto do comprovante de venda.
                  Isso gera uma receita no financeiro desta moto.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-1 py-1">
                <Field
                  label="Valor de venda (R$)"
                  htmlFor="soldPriceCents"
                  error={sellState?.errors?.soldPriceCents}
                  required
                >
                  <CurrencyInput
                    id="soldPriceCents"
                    name="soldPriceCents"
                    defaultValueCents={motorcycle.salePriceCents}
                    required
                  />
                </Field>
                <Field
                  label="Nome do comprador"
                  htmlFor="buyerName"
                  error={sellState?.errors?.buyerName}
                  required
                >
                  <Input id="buyerName" name="buyerName" placeholder="Ex: João Silva" required />
                </Field>
                <Field
                  label="Telefone do comprador (opcional)"
                  htmlFor="buyerPhone"
                  error={sellState?.errors?.buyerPhone}
                >
                  <Input
                    id="buyerPhone"
                    name="buyerPhone"
                    type="tel"
                    placeholder="(11) 99999-0000"
                  />
                </Field>
                <Field
                  label="Comprovantes de venda"
                  htmlFor="saleProofImages"
                  error={sellState?.errors?.saleProofImages}
                  required
                >
                  <MultiImageUpload name="saleProofImages" />
                </Field>
                {sellState?.message && !sellState.success && (
                  <FormMessage message={sellState.message} tone="error" />
                )}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={sellPending}>
                  {sellPending ? "Salvando..." : "Confirmar venda"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {motorcycle.status === "AVAILABLE" && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={statusPending}
          onClick={() => handleStatusChange("RESERVED")}
        >
          Marcar como reservada
        </Button>
      )}
      {motorcycle.status === "RESERVED" && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={statusPending}
          onClick={() => handleStatusChange("AVAILABLE")}
        >
          Voltar para disponível
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button type="button" variant="destructive" size="lg" className="w-full">
              <Trash2 className="size-4" />
              Excluir moto
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta moto?</AlertDialogTitle>
            <AlertDialogDescription>
              Todo o histórico financeiro desta moto será apagado junto. Essa ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteState?.message && !deleteState.success && (
            <FormMessage message={deleteState.message} tone="error" />
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <form action={deleteFormAction}>
              <AlertDialogAction type="submit" variant="destructive" disabled={deletePending}>
                {deletePending ? "Excluindo..." : "Sim, excluir moto"}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {sellState?.success && sellState.message && (
        <FormMessage message={sellState.message} tone="success" />
      )}
    </div>
  );
}
