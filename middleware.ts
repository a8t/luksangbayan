import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  console.log("Token:", token);
  console.log("Is Admin Page:", isAdminPage);
  console.log("Is Login Page:", isLoginPage);

  // Allow access to the login page
  if (isLoginPage) {
    // If user is already logged in and tries to access login page, redirect to dashboard
    if (token) {
      try {
        verify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch {
        // Invalid token, allow access to login page
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      // Clear invalid token
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
