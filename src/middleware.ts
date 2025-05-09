import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLES } from "./types";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Public routes that do not require authentication
    const publicRoutes = ["/", "/login", "/register"];

    // Protected routes and required roles
    const protectedRoutes = [
      { route: "/dashboard", roles: [ROLES.USER, ROLES.CASHIER] },
      { route: "/bingo", roles: [ROLES.CASHIER] },
      { route: "/games", roles: [ROLES.CASHIER] },
      { route: "/profile", roles: [ROLES.USER, ROLES.CASHIER] },
    ];

    // Skip auth checks for public routes
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Handle protected routes
    const matchedRoute = protectedRoutes.find((r) =>
      pathname.startsWith(r.route)
    );
    if (matchedRoute) {
      if (!token) {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
        );
      }

      if (!matchedRoute.roles.includes(token.role as keyof typeof ROLES)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        // Bypass auth for public routes
        if (["/", "/login", "/register"].includes(pathname)) return true;
        // Require auth for all other routes
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
      error: "/unauthorized",
    },
  }
);
