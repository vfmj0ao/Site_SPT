import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/vendedor")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/vendedor/login")) {
    return NextResponse.next();
  }

  const pin = process.env.VENDEDOR_PIN?.trim();
  if (!pin) {
    return NextResponse.next();
  }

  if (request.cookies.get("tpo_vendedor")?.value === "1") {
    return NextResponse.next();
  }

  const login = new URL("/vendedor/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/vendedor/:path*"],
};
