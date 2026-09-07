import "server-only";
import { db } from "@/lib/db";
import { PAGE_SIZE } from "@/components/pagination-bar";

export async function getProducts({ query, page }: { query?: string; page: number }) {
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

  return { products, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
