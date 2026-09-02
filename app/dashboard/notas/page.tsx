import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { formatCentsToBRL, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { SearchForm } from "@/components/search-form";
import { PaginationBar, PAGE_SIZE } from "@/components/pagination-bar";
import { Card } from "@/components/ui/card";
import { ClickableRow } from "@/components/clickable-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim();

  const where = query
    ? {
        OR: [
          { customer: { name: { contains: query, mode: "insensitive" as const } } },
          ...(Number.isInteger(Number(query)) ? [{ number: Number(query) }] : []),
        ],
      }
    : undefined;

  const [invoices, total] = await Promise.all([
    db.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.invoice.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notas"
        description={`${total} nota(s) emitida(s)`}
        action={{ label: "Nova nota", href: "/dashboard/notas/nova", icon: <Plus className="size-4" /> }}
      />

      <SearchForm
        action="/dashboard/notas"
        placeholder="Buscar por cliente ou nº da nota..."
        defaultValue={q}
      />

      <Card className="py-0">
        {invoices.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-10" />}
            message={query ? "Nenhuma nota encontrada." : "Nenhuma nota criada ainda."}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <ClickableRow key={invoice.id} href={`/dashboard/notas/${invoice.id}`}>
                  <TableCell>
                    <Link
                      href={`/dashboard/notas/${invoice.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      #{invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-foreground">{invoice.customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(invoice.issuedAt)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCentsToBRL(invoice.totalCents)}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                </ClickableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/notas"
        searchParams={{ q }}
      />
    </div>
  );
}
