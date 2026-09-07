import "server-only";
import { db } from "@/lib/db";
import { PAGE_SIZE } from "@/components/pagination-bar";

export async function getInvoices({ query, page }: { query?: string; page: number }) {
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

  return { invoices, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
