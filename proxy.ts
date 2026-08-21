import { NextRequest, NextResponse } from "next/server";
import { getCanonicalSlugForOldSlug } from "@/lib/ipoRepository";

export async function proxy(request: NextRequest) {
  const oldSlug = request.nextUrl.pathname.slice("/ipo/".length);
  const canonicalSlug = await getCanonicalSlugForOldSlug(oldSlug);

  if (!canonicalSlug) return NextResponse.next();

  return NextResponse.redirect(
    new URL(`/ipo/${canonicalSlug}`, request.url),
    301
  );
}

export const config = {
  matcher: "/ipo/:slug",
};
