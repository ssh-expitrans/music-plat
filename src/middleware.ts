// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Allow public routes without auth
  const publicPaths = ["/login", "/dashboard"];
  if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    // /dashboard (sample dash) is public
    if (req.nextUrl.pathname.startsWith("/dashboard/personal")) {
      // /dashboard/personal is protected
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      try {
        jwt.verify(token, JWT_SECRET);
        return NextResponse.next();
      } catch {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
    return NextResponse.next();
  }

  // Protect all other routes if you want, or adjust logic here
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/personal/:path*"], // protect personal dashboard only
};
