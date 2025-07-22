import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import auth from "./src/lib/auth";
import { headers } from "next/headers";

export async function middleware(req: NextRequest) {
  // Example: Redirect users trying to access the admin page if not authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return NextResponse.redirect(new URL("/sign-in", req.url));
  const { role } = session.user;
  if (role !== "admin" && role !== "vendor") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: ["/admin/:path((?!sign-in).*)"],
};
