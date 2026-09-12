import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  neutral: "bg-muted text-muted-foreground",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
};

export function StatusPill({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        TONE_CLASS[tone]
      )}
    >
      {label}
    </span>
  );
}

const INVOICE_STATUS: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: "Pendente", tone: "warning" },
  APPROVED: { label: "Aprovada", tone: "success" },
  PARTIAL: { label: "Parcial", tone: "info" },
  CANCELED: { label: "Cancelada", tone: "neutral" },
};

export function InvoiceStatusBadge({ status }: { status: string }) {
  const config = INVOICE_STATUS[status] ?? { label: status, tone: "neutral" as Tone };
  return <StatusPill label={config.label} tone={config.tone} />;
}

const TRANSACTION_STATUS: Record<string, { label: string; tone: Tone }> = {
  PENDENTE: { label: "Pendente", tone: "warning" },
  PAGO: { label: "Pago", tone: "success" },
  CANCELADO: { label: "Cancelado", tone: "neutral" },
};

export function TransactionStatusBadge({ status }: { status: string }) {
  const config = TRANSACTION_STATUS[status] ?? { label: status, tone: "neutral" as Tone };
  return <StatusPill label={config.label} tone={config.tone} />;
}

const MOTORCYCLE_STATUS: Record<string, { label: string; tone: Tone }> = {
  AVAILABLE: { label: "Disponível", tone: "success" },
  RESERVED: { label: "Reservada", tone: "warning" },
  SOLD: { label: "Vendida", tone: "neutral" },
};

export function MotorcycleStatusBadge({ status }: { status: string }) {
  const config = MOTORCYCLE_STATUS[status] ?? { label: status, tone: "neutral" as Tone };
  return <StatusPill label={config.label} tone={config.tone} />;
}
