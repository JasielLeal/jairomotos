import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoletoStatusChart } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/components/boleto-status-chart";
import type { BoletoStats } from "@/app/dashboard/(pages)/financeiro/(pages)/boletos/lib/get-boletos";

export function BoletoStatusCard({ stats }: { stats: BoletoStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Boletos por situação</CardTitle>
        <p className="text-xs text-muted-foreground">
          Boletos em aberto por proximidade do vencimento
        </p>
      </CardHeader>
      <CardContent>
        <BoletoStatusChart stats={stats} />
      </CardContent>
    </Card>
  );
}
