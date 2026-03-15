import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCanonicalRedirectUrl, siteRobotsHeaderValue } from "@/lib/site-config";

export function proxy(request: NextRequest) {
  const redirectUrl = getCanonicalRedirectUrl({
    requestUrl: request.url,
    requestHost:
      request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
    deploymentEnvironment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  });

  if (!redirectUrl) {
    const response = NextResponse.next();

    if (siteRobotsHeaderValue) {
      response.headers.set("x-robots-tag", siteRobotsHeaderValue);
    }

    return response;
  }

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr).*)"],
};
