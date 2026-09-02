"use client";

import { useActionState } from "react";
import { Check, Trash2 } from "lucide-react";
import { approveInvoice, deleteInvoice } from "@/lib/actions/invoices";
import { FormMessage } from "@/components/ui/form";
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

export default function InvoiceActionsPanel({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: "PENDING" | "APPROVED" | "CANCELED";
}) {
  const approveAction = approveInvoice.bind(null, invoiceId);
  const deleteAction = deleteInvoice.bind(null, invoiceId);

  const [approveState, approveFormAction, approvePending] = useActionState(approveAction, undefined);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAction, undefined);

  return (
    <div className="flex flex-col gap-3">
      {status === "PENDING" && (
        <form action={approveFormAction}>
          <Button
            type="submit"
            disabled={approvePending}
            size="lg"
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Check className="size-4" />
            {approvePending ? "Aprovando..." : "Aprovar nota"}
          </Button>
        </form>
      )}

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button type="button" variant="destructive" size="lg" className="w-full">
              <Trash2 className="size-4" />
              Excluir nota
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta nota?</AlertDialogTitle>
            <AlertDialogDescription>
              {status === "APPROVED"
                ? "Os itens vendidos voltam para o estoque e o lançamento financeiro gerado é removido. A nota será apagada permanentemente."
                : "A nota será apagada permanentemente. Essa ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteState?.message && !deleteState.success && (
            <FormMessage message={deleteState.message} tone="error" />
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <form action={deleteFormAction}>
              <AlertDialogAction type="submit" variant="destructive" disabled={deletePending}>
                {deletePending ? "Excluindo..." : "Sim, excluir nota"}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {approveState?.message && (
        <FormMessage message={approveState.message} tone={approveState.success ? "success" : "error"} />
      )}
    </div>
  );
}
