import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import type { OverviewData } from "@/app/dashboard/lib/get-overview-data";

export function LowStockCard({ products }: { products: OverviewData["lowStockProducts"] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Estoque baixo</CardTitle>
        <Link href="/dashboard/estoque" className="text-xs text-muted-foreground hover:underline">
          ver estoque
        </Link>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <EmptyState message="Nenhum produto abaixo do estoque mínimo." />
        ) : (
          <ul className="flex flex-col gap-1">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm"
              >
                <Link href={`/dashboard/estoque/${p.id}`} className="hover:underline">
                  {p.name}
                </Link>
                <span className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                  <TriangleAlert className="size-3.5" />
                  {p.quantity} {p.unit}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
