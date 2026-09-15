import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "juegova_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Login admin nonaktif selama ADMIN_PASSWORD belum di-set, supaya dashboard bisa
 * dipakai dulu tanpa setup. Begitu env-nya diisi, seluruh /admin otomatis minta login.
 *
 * WAJIB di-set sebelum menyambungkan backend penyimpanan sungguhan (Supabase),
 * karena setelah itu perubahan dari dashboard langsung memengaruhi situs live.
 */
export const isAuthEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "juegova-dev";
}

/** Panjang digest selalu sama, jadi perbandingannya tidak bocor lewat timing. */
function digest(value: string) {
  return createHmac("sha256", secret()).update(value).digest();
}

function safeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

function createSessionToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${createHmac("sha256", secret()).update(issuedAt).digest("hex")}`;
}

function verifySessionToken(token: string | undefined) {
  if (!token) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  if (!safeEqual(signature, createHmac("sha256", secret()).update(issuedAt).digest("hex"))) {
    return false;
  }

  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE_SECONDS * 1000;
}

export async function isAuthorized() {
  if (!isAuthEnabled()) return true;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function startSession(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (!safeEqual(password, expected)) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function endSession() {
  (await cookies()).delete(COOKIE_NAME);
}
