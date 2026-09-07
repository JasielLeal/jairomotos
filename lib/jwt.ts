// No "server-only" guard here on purpose: this module is imported both by
// server-only code (lib/session.ts) and by proxy.ts, which runs in the
// Edge runtime — "server-only" breaks module resolution there.
import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";

export type SessionPayload = {
  userId: string;
  role: "ADMIN" | "EMPLOYEE";
  rememberMe: boolean;
  expiresAt: number;
};

export const COOKIE_NAME = "jairomotos_session";
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
export const REMEMBER_ME_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function getEncodedKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não está definido no .env");
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(payload.expiresAt))
    .sign(getEncodedKey());
}

export async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Called from proxy.ts (Next's edge middleware convention) on every request
// to a protected route: slides the session's expiration forward so an active
// user is never logged out mid-use, while an idle session still expires
// after SESSION_DURATION_MS (or REMEMBER_ME_DURATION_MS with "lembrar de mim").
export async function renewSessionCookie(payload: SessionPayload): Promise<NextResponse> {
  const duration = payload.rememberMe ? REMEMBER_ME_DURATION_MS : SESSION_DURATION_MS;
  const expiresAt = Date.now() + duration;
  const renewed = await encrypt({ ...payload, expiresAt });

  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, renewed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(payload.rememberMe ? { expires: new Date(expiresAt) } : {}),
  });
  return response;
}
