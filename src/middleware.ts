import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLES } from "./types";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Define the protected routes and roles required to access them
    const protectedRoutes = [
      { route: "/dashboard", roles: [ROLES.USER, ROLES.CASHIER] },
      { route: "/bingo", roles: [ROLES.CASHIER] },
      { route: "/games", roles: [ROLES.CASHIER] },
      { route: "/profile", roles: [ROLES.USER, ROLES.CASHIER] },
    ];

    // Check if the current route is in the protected routes array
    const route = protectedRoutes.find((r) => pathname.startsWith(r.route));

    if (route) {
      // If the user doesn't have the right role, redirect them to unauthorized
      if (!route.roles.includes(token?.role as keyof typeof ROLES)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure token exists
    },
    pages: {
      signIn: "/login", // Redirect to login if the user is not signed in
      error: "/unauthorized", // Redirect to unauthorized if the user is not authorized
    },
  }
);
