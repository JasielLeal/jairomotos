export const INVOICE_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  PARTIAL: "Parcial",
  CANCELED: "Cancelada",
};

export const INVOICE_STATUS_BAR: Record<string, string> = {
  PENDING: "bg-amber-500",
  APPROVED: "bg-emerald-500",
  PARTIAL: "bg-blue-500",
  CANCELED: "bg-muted-foreground/40",
};

export function monthBuckets(count: number, from: Date) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth() - (count - 1 - i), 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    };
  });
}

export function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

export function sumByType(
  txs: { type: string; amountCents: number }[],
  type: "RECEITA" | "DESPESA"
): number {
  return txs.filter((t) => t.type === type).reduce((sum, t) => sum + t.amountCents, 0);
}

export function formatCompactBRL(cents: number): string {
  const value = cents / 100;
  if (value >= 1_000_000) return `R$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$${(value / 1_000).toFixed(1)}k`;
  return `R$${Math.round(value)}`;
}
