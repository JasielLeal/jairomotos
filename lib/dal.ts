import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { db } from "./db";

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId || session.expiresAt < Date.now()) {
    redirect("/login");
  }

  return { userId: session.userId, role: session.role };
});

export const getCurrentUser = cache(async () => {
  const session = await verifySession();

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
});

export async function requireAdmin() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    throw new Error("Apenas administradores podem executar esta ação.");
  }
  return session;
}
