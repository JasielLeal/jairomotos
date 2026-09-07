import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, decrypt, renewSessionCookie } from "@/lib/jwt";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decrypt(request.cookies.get(COOKIE_NAME)?.value);

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && session) {
    const destination = session.role === "ADMIN" ? "/dashboard" : "/dashboard/estoque";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Sliding session: an active user visiting a protected route gets their
  // cookie's expiration pushed forward, so they're never logged out mid-use.
  // An idle session still expires normally after SESSION_DURATION_MS (or
  // REMEMBER_ME_DURATION_MS with "lembrar de mim").
  if (isProtectedRoute && session) {
    return renewSessionCookie(session);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
