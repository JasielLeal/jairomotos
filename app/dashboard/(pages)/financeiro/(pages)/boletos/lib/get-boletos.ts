import "server-only";
import { db } from "@/lib/db";
import { PAGE_SIZE } from "@/components/pagination-bar";

export const BOLETO_DUE_SOON_DAYS = 7;

export type BoletoStatusFilter = "PENDENTE" | "PAGO" | "CANCELADO" | undefined;

export async function getBoletos({
  statusFilter,
  page,
}: {
  statusFilter: BoletoStatusFilter;
  page: number;
}) {
  const where = statusFilter ? { status: statusFilter } : {};

  const [boletos, total] = await Promise.all([
    db.boleto.findMany({
      where,
      orderBy: { dueDate: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.boleto.count({ where }),
  ]);

  return { boletos, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getBoletoAlerts() {
  const now = new Date();
  const dueSoonLimit = new Date(now.getTime() + BOLETO_DUE_SOON_DAYS * 24 * 60 * 60 * 1000);

  const [overdue, dueSoon] = await Promise.all([
    db.boleto.findMany({
      where: { status: "PENDENTE", dueDate: { lt: now } },
      orderBy: { dueDate: "asc" },
    }),
    db.boleto.findMany({
      where: { status: "PENDENTE", dueDate: { gte: now, lte: dueSoonLimit } },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return { overdue, dueSoon };
}

export type BoletoAlerts = Awaited<ReturnType<typeof getBoletoAlerts>>;
