import { NextRequest, NextResponse } from "next/server";
import { getUserTokenFromRequest } from "@/lib/utils/auth/middleware-cookie";

const PUBLIC_PATHS = ["/", "/login", "/register", "/onboarding", "/forgot-password", "/reset-password"];
const AUTH_ONLY_PATHS = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = getUserTokenFromRequest(req);

  const isPublic =
    pathname === "/" ||
    PUBLIC_PATHS.some((path) => path !== "/" && pathname.startsWith(path));
  const isAuthOnly = AUTH_ONLY_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthOnly) {
    return NextResponse.redirect(new URL("/learn", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
