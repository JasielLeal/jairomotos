import "server-only";
import { db } from "@/lib/db";
import { monthBuckets, pctChange, sumByType } from "./utils";
import type { RevenueTrendPoint } from "./types";

export async function getOverviewData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const buckets = monthBuckets(12, now);
  const chartStart = new Date(buckets[0].year, buckets[0].month, 1);

  const [
    productCount,
    activeProducts,
    pendingInvoices,
    monthTransactions,
    prevMonthTransactions,
    chartTransactions,
    recentInvoices,
    invoiceStatusGroups,
    topCreators,
    invoiceTotals,
  ] = await Promise.all([
    db.product.count({ where: { active: true } }),
    db.product.findMany({ where: { active: true }, orderBy: { quantity: "asc" } }),
    db.invoice.count({ where: { status: "PENDING" } }),
    db.financialTransaction.findMany({
      where: { date: { gte: startOfMonth }, status: { not: "CANCELADO" } },
    }),
    db.financialTransaction.findMany({
      where: { date: { gte: startOfPrevMonth, lt: startOfMonth }, status: { not: "CANCELADO" } },
    }),
    db.financialTransaction.findMany({
      where: { date: { gte: chartStart }, status: { not: "CANCELADO" } },
      select: { date: true, type: true, amountCents: true },
    }),
    db.invoice.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { customer: true } }),
    db.invoice.groupBy({ by: ["status"], _count: { _all: true } }),
    db.invoice.groupBy({
      by: ["createdById"],
      where: { createdAt: { gte: startOfMonth } },
      _count: { createdById: true },
      _sum: { totalCents: true },
      orderBy: { _count: { createdById: "desc" } },
      take: 5,
    }),
    db.invoice.aggregate({ _sum: { totalCents: true } }),
  ]);

  const lowStockProducts = activeProducts.filter((p) => p.quantity <= p.minStock).slice(0, 5);

  const revenue = sumByType(monthTransactions, "RECEITA");
  const expense = sumByType(monthTransactions, "DESPESA");
  const prevRevenue = sumByType(prevMonthTransactions, "RECEITA");
  const prevExpense = sumByType(prevMonthTransactions, "DESPESA");

  const revenueTrend: RevenueTrendPoint[] = buckets.map(({ year, month, label }) => {
    const bucketTx = chartTransactions.filter(
      (t) => t.date.getFullYear() === year && t.date.getMonth() === month
    );
    return {
      month: label,
      receitaCents: sumByType(bucketTx, "RECEITA"),
      despesaCents: sumByType(bucketTx, "DESPESA"),
    };
  });

  const totalInvoices = invoiceStatusGroups.reduce((sum, g) => sum + g._count._all, 0);
  const invoiceStatusBreakdown = ["PENDING", "APPROVED", "CANCELED"].map((status) => {
    const group = invoiceStatusGroups.find((g) => g.status === status);
    const count = group?._count._all ?? 0;
    return {
      status,
      count,
      percent: totalInvoices === 0 ? 0 : Math.round((count / totalInvoices) * 100),
    };
  });

  const creatorUsers = await db.user.findMany({
    where: { id: { in: topCreators.map((c) => c.createdById) } },
    select: { id: true, name: true },
  });
  const topPerformers = topCreators.map((c) => ({
    userId: c.createdById,
    name: creatorUsers.find((u) => u.id === c.createdById)?.name ?? "—",
    invoiceCount: c._count.createdById,
    totalCents: c._sum.totalCents ?? 0,
  }));

  return {
    productCount,
    lowStockProducts,
    pendingInvoices,
    revenue,
    expense,
    balance: revenue - expense,
    revenueTrend: {
      revenueDelta: pctChange(revenue, prevRevenue),
      expenseDelta: pctChange(expense, prevExpense),
      points: revenueTrend,
    },
    recentInvoices,
    invoiceStatusBreakdown,
    totalInvoices,
    totalInvoicedCents: invoiceTotals._sum.totalCents ?? 0,
    topPerformers,
  };
}

export type OverviewData = Awaited<ReturnType<typeof getOverviewData>>;
