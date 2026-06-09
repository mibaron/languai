import { NextRequest, NextResponse } from "next/server";
import { getUserTokenFromRequest } from "@/lib/utils/auth/middleware-cookie";

const PUBLIC_PATHS = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = getUserTokenFromRequest(req);

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
