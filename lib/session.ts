import "server-only";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  REMEMBER_ME_DURATION_MS,
  SESSION_DURATION_MS,
  decrypt,
  encrypt,
  type SessionPayload,
} from "@/lib/jwt";

export type { SessionPayload };

export async function createSession(
  userId: string,
  role: "ADMIN" | "EMPLOYEE",
  rememberMe = false
) {
  const duration = rememberMe ? REMEMBER_ME_DURATION_MS : SESSION_DURATION_MS;
  const expiresAt = Date.now() + duration;
  const session = await encrypt({ userId, role, rememberMe, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Sem "lembrar de mim": cookie de sessão do navegador (sem `expires`), some ao fechar o navegador.
    ...(rememberMe ? { expires: new Date(expiresAt) } : {}),
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
