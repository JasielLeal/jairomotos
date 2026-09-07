import "server-only";
import { db } from "@/lib/db";
import { PAGE_SIZE } from "@/components/pagination-bar";
import type { MotorcycleStatus } from "@prisma/client";

export async function getMotorcycles({
  query,
  status,
  page,
}: {
  query?: string;
  status?: MotorcycleStatus;
  page: number;
}) {
  const where = {
    ...(status ? { status } : {}),
    ...(query
      ? {
          OR: [
            { brand: { contains: query, mode: "insensitive" as const } },
            { model: { contains: query, mode: "insensitive" as const } },
            { plate: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [motorcycles, total] = await Promise.all([
    db.motorcycle.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.motorcycle.count({ where }),
  ]);

  return { motorcycles, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
