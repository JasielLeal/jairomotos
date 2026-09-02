import Link from "next/link";
import { Plus, Package, TriangleAlert } from "lucide-react";
import { db } from "@/lib/db";
import { formatCentsToBRL } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ClickableRow } from "@/components/clickable-row";
import { SearchForm } from "@/components/search-form";
import { PaginationBar, PAGE_SIZE } from "@/components/pagination-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim();

  const where = {
    active: true,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { category: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Estoque"
        description={`${total} produto(s) cadastrado(s)`}
        action={{ label: "Novo produto", href: "/dashboard/estoque/novo", icon: <Plus className="size-4" /> }}
      />

      <SearchForm
        action="/dashboard/estoque"
        placeholder="Buscar por nome ou categoria..."
        defaultValue={q}
      />

      <Card className="py-0">
        {products.length === 0 ? (
          <EmptyState
            icon={<Package className="size-10" />}
            message={query ? "Nenhum produto encontrado." : "Nenhum produto cadastrado ainda."}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Custo</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const low = product.quantity <= product.minStock;
                return (
                  <ClickableRow key={product.id} href={`/dashboard/estoque/${product.id}`}>
                    <TableCell>
                      <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
                        {product.imageData ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageData}
                            alt={product.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Package className="size-4 text-muted-foreground/40" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/estoque/${product.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category || "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      {formatCentsToBRL(product.costCents)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCentsToBRL(product.priceCents)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          low
                            ? "inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400"
                            : "text-foreground"
                        }
                      >
                        {low && <TriangleAlert className="size-3.5" />}
                        {product.quantity} {product.unit}
                      </span>
                    </TableCell>
                  </ClickableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/estoque"
        searchParams={{ q }}
      />
    </div>
  );
}
