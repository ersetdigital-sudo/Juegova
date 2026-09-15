"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageIcon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export interface UploadedImage {
  url: string;
  width: number;
  height: number;
}

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string, meta?: { width: number; height: number }) => void;
  placeholder?: string;
}

/**
 * Input gambar dengan tombol upload ke Cloudinary (unsigned preset).
 *
 * Unggahan dikirim langsung dari browser ke Cloudinary, jadi file tidak lewat
 * server kita. Karena unsigned, API secret tidak dipakai sama sekali — yang
 * dibutuhkan hanya cloud name dan nama preset.
 */
export function ImageUploadField({ value, onChange, placeholder }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  const handleFile = async (file: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Format harus PNG, JPG, atau WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Ukuran maksimal 2 MB, file ini ${(file.size / 1048576).toFixed(1)} MB.`);
      return;
    }
    if (!configured) {
      setError("Upload belum dikonfigurasi. Hubungi pengembang.");
      return;
    }

    setPending(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body },
      );
      const data = (await response.json()) as {
        secure_url?: string;
        width?: number;
        height?: number;
        error?: { message?: string };
      };

      if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message ?? "Upload gagal. Coba lagi.");
      }

      onChange(data.secure_url, {
        width: data.width ?? 0,
        height: data.height ?? 0,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload gagal. Coba lagi.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {value ? (
            <Image
              src={value}
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-slate-300" />
          )}
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder ?? "https://... atau /images/namafile.webp"}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-colors outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={pending || !configured}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/25 transition-all grad hover:brightness-110 active:scale-[.98] disabled:opacity-50 disabled:shadow-none"
            >
              {pending ? "Mengunggah..." : "Upload gambar"}
            </button>

            {value ? (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  onChange("");
                }}
                className="rounded-full border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 shadow-sm transition-colors hover:bg-rose-50"
              >
                Hapus
              </button>
            ) : null}

            {!configured ? (
              <span className="text-[11px] font-semibold text-amber-600">
                Upload belum dikonfigurasi
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className={cx("hidden")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {error ? (
        <p role="alert" className="text-[11px] font-bold text-rose-600">
          {error}
        </p>
      ) : (
        <p className="text-[11px] text-slate-400">PNG, JPG, atau WebP. Maksimal 2 MB.</p>
      )}
    </div>
  );
}
