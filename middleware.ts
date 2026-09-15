import { NextResponse, type NextRequest } from "next/server";

/**
 * HTML statis lama memakai URL /game?id=xxx. Dipindahkan ke /game/xxx supaya
 * URL-nya SEO-friendly dan link lama tetap jalan.
 *
 * Dipakai middleware, bukan `redirects()` di next.config, karena redirect bawaan
 * Next selalu membawa query string lama ke URL tujuan (?id=xxx ikut terbawa).
 */
export function middleware(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const url = request.nextUrl.clone();

  // Hanya buang parameter id; parameter lain (mis. utm_source) tetap dibawa.
  url.searchParams.delete("id");
  // Tanpa id, tidak ada game yang bisa ditebak — arahkan ke katalog di beranda.
  url.pathname = id ? `/game/${id}` : "/";

  return NextResponse.redirect(url, 308);
}

export const config = {
  // Hanya berlaku untuk path /game lama, tidak menyentuh /game/[slug].
  matcher: "/game",
};
