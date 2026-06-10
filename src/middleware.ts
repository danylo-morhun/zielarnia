import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isKonto = req.nextUrl.pathname.startsWith("/konto");

  if (isKonto && !isLoggedIn) {
    const loginUrl = new URL("/logowanie", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/konto/:path*"],
};
