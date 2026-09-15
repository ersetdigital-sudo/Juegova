/**
 * Satu tempat untuk tahu backend penyimpanan mana yang aktif.
 *
 * - Supabase (kalau env-nya diisi) dipakai di produksi.
 * - Tanpa Supabase, data disimpan sebagai file JSON di folder content/
 *   supaya `npm run dev` tetap bisa dipakai tanpa menyentuh data produksi.
 */
const supabaseEnv = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
};

export const isSupabaseConfigured = () => supabaseEnv() !== null;

export function supabaseConfig() {
  const config = supabaseEnv();
  if (!config) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return config;
}

/** Header standar untuk PostgREST. Service key hanya dipakai di server. */
export function supabaseHeaders(key: string, extra: Record<string, string> = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

export async function supabaseFetch(path: string, init: RequestInit = {}) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: supabaseHeaders(key, {
      "Content-Type": "application/json",
      ...((init.headers as Record<string, string>) ?? {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 180);
    throw new Error(`Supabase ${response.status}: ${detail}`);
  }

  return response;
}

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);
