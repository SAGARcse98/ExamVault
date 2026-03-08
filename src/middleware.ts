import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        // Admin routes protection
        if (pathname.startsWith("/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Public routes
                if (
                    pathname === "/" ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/api/register")
                ) {
                    return true;
                }

                // All other routes require authentication
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
