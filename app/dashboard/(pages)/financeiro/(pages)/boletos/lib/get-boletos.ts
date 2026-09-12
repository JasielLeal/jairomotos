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
      include: { invoice: { select: { number: true } } },
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

export async function getBoletoStats() {
  const now = new Date();
  const dueSoonLimit = new Date(now.getTime() + BOLETO_DUE_SOON_DAYS * 24 * 60 * 60 * 1000);

  const [overdue, dueSoon, upcoming, paid] = await Promise.all([
    db.boleto.aggregate({
      where: { status: "PENDENTE", dueDate: { lt: now } },
      _count: { _all: true },
      _sum: { amountCents: true },
    }),
    db.boleto.aggregate({
      where: { status: "PENDENTE", dueDate: { gte: now, lte: dueSoonLimit } },
      _count: { _all: true },
      _sum: { amountCents: true },
    }),
    db.boleto.aggregate({
      where: { status: "PENDENTE", dueDate: { gt: dueSoonLimit } },
      _count: { _all: true },
      _sum: { amountCents: true },
    }),
    db.boleto.aggregate({
      where: { status: "PAGO" },
      _count: { _all: true },
      _sum: { amountCents: true },
    }),
  ]);

  const toBucket = (result: typeof overdue) => ({
    count: result._count._all,
    amountCents: result._sum.amountCents ?? 0,
  });

  const overdueBucket = toBucket(overdue);
  const dueSoonBucket = toBucket(dueSoon);
  const upcomingBucket = toBucket(upcoming);
  const paidBucket = toBucket(paid);

  return {
    overdue: overdueBucket,
    dueSoon: dueSoonBucket,
    upcoming: upcomingBucket,
    paid: paidBucket,
    openCount: overdueBucket.count + dueSoonBucket.count + upcomingBucket.count,
    openCents: overdueBucket.amountCents + dueSoonBucket.amountCents + upcomingBucket.amountCents,
  };
}

export type BoletoStats = Awaited<ReturnType<typeof getBoletoStats>>;
