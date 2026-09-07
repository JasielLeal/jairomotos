import "server-only";
import { db } from "@/lib/db";
import { PAGE_SIZE } from "@/components/pagination-bar";

export type MotoTransactionTypeFilter = "RECEITA" | "DESPESA" | undefined;

export async function getMotoFinance({
  typeFilter,
  page,
}: {
  typeFilter: MotoTransactionTypeFilter;
  page: number;
}) {
  const where = typeFilter ? { type: typeFilter } : {};

  const [allTransactions, transactions, total, stockCount, soldCount] = await Promise.all([
    db.motoTransaction.findMany({ select: { type: true, amountCents: true } }),
    db.motoTransaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        motorcycle: {
          select: { id: true, brand: true, model: true, year: true, buyerName: true },
        },
      },
    }),
    db.motoTransaction.count({ where }),
    db.motorcycle.count({ where: { status: { not: "SOLD" } } }),
    db.motorcycle.count({ where: { status: "SOLD" } }),
  ]);

  const invested = allTransactions
    .filter((t) => t.type === "DESPESA")
    .reduce((sum, t) => sum + t.amountCents, 0);
  const revenue = allTransactions
    .filter((t) => t.type === "RECEITA")
    .reduce((sum, t) => sum + t.amountCents, 0);

  return {
    transactions,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    invested,
    revenue,
    profit: revenue - invested,
    stockCount,
    soldCount,
  };
}
