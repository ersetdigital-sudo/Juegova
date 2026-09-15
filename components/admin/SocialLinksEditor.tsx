"use client";

import { useState, useTransition } from "react";
import { buildPatch, Panel, SaveButton } from "./fields";
import { Toast } from "./Toast";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SOCIAL_PLATFORMS, normalizeSocials } from "@/data/social";
import { cx } from "@/lib/cx";
import type { ActionResult, SocialLink, SocialPlatformId } from "@/types";

const SUCCESS_MESSAGE = "Link media sosial berhasil diperbarui";

interface SocialLinksEditorProps {
  initial: SocialLink[];
  action: (patch: Record<string, unknown>) => Promise<ActionResult>;
}

/**
 * Form media sosial sengaja cuma berisi URL.
 *
 * Platformnya tetap dan urutannya sudah ditentukan sistem, jadi tidak ada field
 * nama platform, tidak ada huruf singkatan, dan tidak ada tombol urutkan/hapus.
 * Mengosongkan URL = ikon platform itu hilang dari footer.
 */
export function SocialLinksEditor({ initial, action }: SocialLinksEditorProps) {
  const [links, setLinks] = useState<SocialLink[]>(() => normalizeSocials(initial));
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const setUrl = (id: SocialPlatformId, url: string) => {
    setLinks((current) =>
      current.map((link) => (link.id === id ? { ...link, url } : link)),
    );
    setError(null);
  };

  const urlOf = (id: SocialPlatformId) => links.find((link) => link.id === id)?.url ?? "";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await action(buildPatch("settings.socials", links));
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setToast(SUCCESS_MESSAGE);
      window.setTimeout(() => setToast(null), 3200);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Panel
          title="Media sosial"
          description="Cukup isi URL profilnya. Kosongkan kalau belum ada — ikon platform itu tidak akan tampil di footer."
          footer={
            <>
              <SaveButton pending={pending} />
              {error ? (
                <span role="alert" className="text-xs font-semibold text-rose-600">
                  {error}
                </span>
              ) : null}
            </>
          }
        >
          <div className="space-y-3">
            {SOCIAL_PLATFORMS.map((platform) => {
              const url = urlOf(platform.id);
              const filled = url.trim().length > 0;

              return (
                <div
                  key={platform.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className="flex shrink-0 items-center gap-2 sm:w-44">
                    <span
                      className={cx(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors",
                        filled
                          ? "border-blue-100 bg-blue-50 text-blue-600"
                          : "border-slate-200 bg-slate-50 text-slate-300",
                      )}
                    >
                      <SocialIcon platform={platform.id} className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold text-slate-700">{platform.label}</span>
                  </span>

                  <input
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(platform.id, event.target.value)}
                    placeholder={platform.example}
                    aria-label={`URL profil ${platform.label}`}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-colors outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
            Platform dan urutannya sudah tetap, jadi tidak perlu diatur lagi.
          </p>
        </Panel>
      </form>

      <Toast message={toast} />
    </>
  );
}
