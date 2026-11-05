import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  roleHome,
  verifyToken,
} from "@/lib/auth/jwt";

// Routes that are always accessible without a session.
const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
  "/verify-otp",
  "/admission",
  "/about",
]);

const AUTH_ROUTES = new Set(["/login", "/signup", "/verify-otp"]);

const PROTECTED_ROUTES: Array<{ prefix: string; role: "admin" | "teacher" }> = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/teacher", role: "teacher" },
];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifyToken(token);

  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  const protectedRoute = PROTECTED_ROUTES.find((route) =>
    matchesPrefix(pathname, route.prefix)
  );

  // Signed-in users should not see login/OTP pages.
  if (session && !session.pending && isAuthRoute) {
    return NextResponse.redirect(new URL(roleHome(session.role), request.url));
  }

  if (protectedRoute) {
    if (!session || session.pending) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== protectedRoute.role) {
      return NextResponse.redirect(new URL(roleHome(session.role), request.url));
    }
  }

  // Unknown routes and public routes are handled by the app (including 404s).
  if (isPublicRoute || isAuthRoute || protectedRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals, API routes, and static files.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
