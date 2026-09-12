"use client";

import { useActionState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import {
  markBoletoPaid,
  cancelBoleto,
  deleteBoleto,
} from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/actions";
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

export function BoletoRowActions({
  boletoId,
  status,
}: {
  boletoId: string;
  status: "PENDENTE" | "PAGO" | "CANCELADO";
}) {
  const payAction = markBoletoPaid.bind(null, boletoId);
  const cancelAction = cancelBoleto.bind(null, boletoId);
  const deleteAction = deleteBoleto.bind(null, boletoId);

  const [, payFormAction, payPending] = useActionState(payAction, undefined);
  const [, cancelFormAction, cancelPending] = useActionState(cancelAction, undefined);
  const [, deleteFormAction, deletePending] = useActionState(deleteAction, undefined);

  return (
    <div className="flex items-center justify-end gap-1.5">
      {status === "PENDENTE" && (
        <>
          <form action={payFormAction}>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={payPending}
              className="border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
            >
              <Check className="size-3.5" />
              {payPending ? "Baixando..." : "Baixar"}
            </Button>
          </form>
          <form action={cancelFormAction}>
            <Button type="submit" size="sm" variant="ghost" disabled={cancelPending} className="text-muted-foreground">
              <X className="size-3.5" />
              Cancelar
            </Button>
          </form>
        </>
      )}
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Excluir boleto"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este boleto?</AlertDialogTitle>
            <AlertDialogDescription>
              {status === "PAGO"
                ? "O lançamento financeiro gerado por esse boleto também será removido."
                : "Essa ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <form action={deleteFormAction}>
              <AlertDialogAction type="submit" variant="destructive" disabled={deletePending}>
                {deletePending ? "Excluindo..." : "Sim, excluir"}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
