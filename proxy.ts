import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "jairomotos_session";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(request.cookies.get(COOKIE_NAME)?.value);

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";

  if (isProtectedRoute && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
