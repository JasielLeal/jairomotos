import "server-only";
import { db } from "@/lib/db";

export function getUsers() {
  return db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}
