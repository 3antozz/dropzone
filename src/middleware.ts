import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*", "/2fa-setup", "/2fa-login", "/login", "/register", "/settings", "/edit/:path*"],
}

export async function middleware(req: NextRequest) {
  const session = await auth();

  if(req.nextUrl.pathname === "/2fa-login") {
    const twoFA_pending = req.cookies.get("2fa_user")?.name;
    if(!twoFA_pending) {
        return NextResponse.redirect(new URL("/login", req.url));
    } else {
        return NextResponse.next();
    }
  }

  if (!session && (req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/register")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if(session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if(session?.user.twoFA && req.nextUrl.pathname === "/2fa-setup") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if(session && req.nextUrl.pathname === "/2fa-login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

//   if (session?.user.twoFactorPending && req.nextUrl.pathname !== "/2fa-login") {
//     return NextResponse.redirect(new URL("/2fa-login", req.url));
//   }

  return NextResponse.next();
}