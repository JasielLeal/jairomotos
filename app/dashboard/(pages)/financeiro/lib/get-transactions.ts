import "server-only";
import { db } from "@/lib/db";
import { PAGE_SIZE } from "@/components/pagination-bar";

export type TransactionTypeFilter = "RECEITA" | "DESPESA" | undefined;

export async function getTransactions({
  typeFilter,
  query,
  page,
}: {
  typeFilter: TransactionTypeFilter;
  query?: string;
  page: number;
}) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const where = {
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(query
      ? {
          OR: [
            { description: { contains: query, mode: "insensitive" as const } },
            { category: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [monthTransactions, transactions, total] = await Promise.all([
    db.financialTransaction.findMany({
      where: { date: { gte: startOfMonth }, status: { not: "CANCELADO" } },
    }),
    db.financialTransaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { invoice: { select: { number: true } } },
    }),
    db.financialTransaction.count({ where }),
  ]);

  const revenue = monthTransactions
    .filter((t) => t.type === "RECEITA")
    .reduce((sum, t) => sum + t.amountCents, 0);
  const expense = monthTransactions
    .filter((t) => t.type === "DESPESA")
    .reduce((sum, t) => sum + t.amountCents, 0);

  return {
    transactions,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    revenue,
    expense,
  };
}
