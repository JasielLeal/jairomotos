import { AlertTriangle, CheckCircle2, Clock, Wallet } from "lucide-react";
import { formatCentsToBRL } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import {
  BOLETO_DUE_SOON_DAYS,
  type BoletoStats as BoletoStatsData,
} from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/get-boletos";

function boletoCountLabel(count: number) {
  return `${count} boleto${count === 1 ? "" : "s"}`;
}

export function BoletoStats({ stats }: { stats: BoletoStatsData }) {
  const items = [
    {
      label: "Em aberto",
      value: formatCentsToBRL(stats.openCents),
      helper: boletoCountLabel(stats.openCount),
      icon: Wallet,
      valueTone: "text-foreground",
      iconTone: "text-muted-foreground/60",
    },
    {
      label: "Vencidos",
      value: formatCentsToBRL(stats.overdue.amountCents),
      helper: boletoCountLabel(stats.overdue.count),
      icon: AlertTriangle,
      valueTone: "text-red-600 dark:text-red-400",
      iconTone: "text-red-500/50",
    },
    {
      label: `Vencendo em ${BOLETO_DUE_SOON_DAYS} dias`,
      value: formatCentsToBRL(stats.dueSoon.amountCents),
      helper: boletoCountLabel(stats.dueSoon.count),
      icon: Clock,
      valueTone: "text-amber-600 dark:text-amber-400",
      iconTone: "text-amber-500/50",
    },
    {
      label: "Pago",
      value: formatCentsToBRL(stats.paid.amountCents),
      helper: boletoCountLabel(stats.paid.count),
      icon: CheckCircle2,
      valueTone: "text-emerald-600 dark:text-emerald-400",
      iconTone: "text-emerald-500/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`mt-1 font-heading text-2xl font-semibold ${item.valueTone}`}>{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
            </div>
            <item.icon className={`size-8 shrink-0 ${item.iconTone}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
