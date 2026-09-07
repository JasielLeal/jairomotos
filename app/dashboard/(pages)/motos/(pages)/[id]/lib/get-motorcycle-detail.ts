import "server-only";
import { db } from "@/lib/db";

export async function getMotorcycleDetail(id: string) {
  const motorcycle = await db.motorcycle.findUnique({ where: { id } });
  if (!motorcycle) return null;

  const transactions = await db.motoTransaction.findMany({
    where: { motorcycleId: id },
    orderBy: { date: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

  const invested = transactions
    .filter((t) => t.type === "DESPESA")
    .reduce((sum, t) => sum + t.amountCents, 0);
  const received = transactions
    .filter((t) => t.type === "RECEITA")
    .reduce((sum, t) => sum + t.amountCents, 0);

  return { motorcycle, transactions, invested, received, profit: received - invested };
}
