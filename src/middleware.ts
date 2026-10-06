import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0]; // Remove port if any
  const pathname = url.pathname;

  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "invitation.luxury";
  let subdomain = "";

  // 1. Check for subdomain routing (e.g. sarah-and-john.invitation.luxury)
  if (hostname.endsWith(`.${baseDomain}`)) {
    subdomain = hostname.substring(0, hostname.length - baseDomain.length - 1);
  } else if (hostname.endsWith(".localhost") && hostname !== "localhost") {
    subdomain = hostname.substring(0, hostname.length - ".localhost".length);
  }

  const systemSubdomains = ["www", "api", "admin", "checkout", "dashboard", "templates", "mail", "support"];

  if (subdomain && !systemSubdomains.includes(subdomain.toLowerCase())) {
    const targetPath = `/invite/${subdomain}${pathname === "/" ? "" : pathname}`;
    url.pathname = targetPath;
    return NextResponse.rewrite(url);
  }

  // 2. Reserved system root paths for the main application
  const reservedRootPaths = [
    "",
    "/",
    "/login",
    "/checkout",
    "/dashboard",
    "/design",
    "/templates",
    "/pricing",
    "/reviews",
    "/privacy-policy",
    "/terms-of-service",
    "/invite",
    "/api",
    "/not-found",
  ];

  const firstSegment = pathname.split("/")[1]?.toLowerCase() || "";

  const isReserved = reservedRootPaths.some(
    (p) => p === pathname || (p !== "/" && p !== "" && pathname.startsWith(p))
  );

  // If path is root slug like /sarah-and-john or /sarah-and-john/g/token
  if (!isReserved && firstSegment && !firstSegment.startsWith("_")) {
    url.pathname = `/invite${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - demos (template static files/demos)
     * - fonts (fonts directory)
     * - image (images directory)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|demos|fonts|image|favicon.ico).*)",
  ],
};
