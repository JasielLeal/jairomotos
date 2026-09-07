import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  invertTrendTone = false,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number | null;
  invertTrendTone?: boolean;
}) {
  const isZero = trend === 0;
  const isUp = typeof trend === "number" && trend > 0;
  const positiveIsGood = invertTrendTone ? !isUp : isUp;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </span>
        </div>
        <div>
          <p className="font-heading text-2xl font-semibold text-foreground">{value}</p>
          {typeof trend === "number" && (
            <p
              className={cn(
                "mt-1.5 inline-flex items-center gap-1 text-xs font-medium",
                isZero
                  ? "text-muted-foreground"
                  : positiveIsGood
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
              )}
            >
              {isZero ? (
                <Minus className="size-3.5" />
              ) : isUp ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {Math.abs(trend).toFixed(1)}% vs mês anterior
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
