"use client";

import { useActionState, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import {
  approveInvoice,
  approveInvoicePartial,
  deleteInvoice,
} from "@/app/dashboard/(pages)/notas/lib/actions";
import { markBoletoPaid } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/actions";
import { Field, CurrencyInput, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/lib/format";
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
  totalCents,
  remainderBoletoId,
  remainderAmountCents,
}: {
  invoiceId: string;
  status: "PENDING" | "APPROVED" | "PARTIAL" | "CANCELED";
  totalCents: number;
  remainderBoletoId?: string;
  remainderAmountCents?: number;
}) {
  const [paymentMode, setPaymentMode] = useState<"full" | "partial">("full");

  const approveAction = approveInvoice.bind(null, invoiceId);
  const approvePartialAction = approveInvoicePartial.bind(null, invoiceId);
  const confirmRemainderAction = markBoletoPaid.bind(null, remainderBoletoId ?? "");
  const deleteAction = deleteInvoice.bind(null, invoiceId);

  const [approveState, approveFormAction, approvePending] = useActionState(approveAction, undefined);
  const [partialState, partialFormAction, partialPending] = useActionState(
    approvePartialAction,
    undefined
  );
  const [confirmState, confirmFormAction, confirmPending] = useActionState(
    confirmRemainderAction,
    undefined
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAction, undefined);

  return (
    <div className="flex flex-col gap-3">
      {status === "PENDING" && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button size="lg" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                <Check className="size-4" />
                Aprovar nota
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Aprovar nota</AlertDialogTitle>
              <AlertDialogDescription>
                Valor total:{" "}
                <span className="font-semibold text-foreground">{formatCentsToBRL(totalCents)}</span>. Como
                o cliente vai pagar?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex gap-2">
              <Button
                type="button"
                variant={paymentMode === "full" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setPaymentMode("full")}
              >
                Pagou tudo
              </Button>
              <Button
                type="button"
                variant={paymentMode === "partial" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setPaymentMode("partial")}
              >
                Vai ficar parcelado
              </Button>
            </div>

            {paymentMode === "full" ? (
              <form action={approveFormAction} className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  O estoque dos itens é baixado e o valor cheio entra no financeiro agora.
                </p>
                {approveState?.message && (
                  <FormMessage
                    message={approveState.message}
                    tone={approveState.success ? "success" : "error"}
                  />
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    disabled={approvePending}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {approvePending ? "Aprovando..." : "Confirmar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            ) : (
              <form action={partialFormAction} className="flex flex-col gap-3">
                <Field
                  label="Valor da entrada (R$)"
                  htmlFor="paidCents"
                  error={partialState?.errors?.paidCents}
                  required
                >
                  <CurrencyInput id="paidCents" name="paidCents" required />
                </Field>
                <Field
                  label="Data para pagar o restante"
                  htmlFor="remainingDueDate"
                  error={partialState?.errors?.remainingDueDate}
                  required
                >
                  <Input id="remainingDueDate" name="remainingDueDate" type="date" required />
                </Field>
                <p className="text-xs text-muted-foreground">
                  O restante vira um boleto a receber com a data escolhida.
                </p>
                {partialState?.message && (
                  <FormMessage
                    message={partialState.message}
                    tone={partialState.success ? "success" : "error"}
                  />
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction type="submit" disabled={partialPending}>
                    {partialPending ? "Salvando..." : "Confirmar entrada"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            )}
          </AlertDialogContent>
        </AlertDialog>
      )}

      {status === "PARTIAL" && remainderBoletoId && (
        <form action={confirmFormAction}>
          <Button
            type="submit"
            disabled={confirmPending}
            size="lg"
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Check className="size-4" />
            {confirmPending
              ? "Confirmando..."
              : `Confirmar pagamento do restante${
                  remainderAmountCents ? ` (${formatCentsToBRL(remainderAmountCents)})` : ""
                }`}
          </Button>
        </form>
      )}
      {confirmState?.message && (
        <FormMessage message={confirmState.message} tone={confirmState.success ? "success" : "error"} />
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
              {status === "APPROVED" || status === "PARTIAL"
                ? "Os itens vendidos voltam para o estoque e o lançamento financeiro gerado é removido" +
                  (status === "PARTIAL" ? ", junto com o boleto do restante" : "") +
                  ". A nota será apagada permanentemente."
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
    </div>
  );
}
