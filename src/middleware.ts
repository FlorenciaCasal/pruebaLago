import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "auth_token";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Zonas protegidas
    const needsAuth =
        pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

    if (!needsAuth) return NextResponse.next();

    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        // opcional: volver a donde estaba después de loguearse
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Sólo corre en /admin y /api/admin
export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
