import "server-only";
import { db } from "@/lib/db";

export function getAvailableMotorcycles() {
  return db.motorcycle.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
  });
}
