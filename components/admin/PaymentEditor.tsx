"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  BadgeCheckIcon,
  ClockBadgeIcon,
  GamepadIcon,
  ImageIcon,
  SearchIcon,
} from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import { PAYMENT_TYPE_LABEL, isPaymentMethodReady } from "@/lib/payments/shared";
import type { ActionResult } from "@/types";
import type { PaymentMethod, PaymentType } from "@/types";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-colors outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10";

const SMALL = "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:shadow-none";

interface PaymentEditorProps {
  methods: PaymentMethod[];
  action: (methods: PaymentMethod[]) => Promise<ActionResult>;
}

const blankMethod = (): PaymentMethod => ({
  id: crypto.randomUUID(),
  name: "",
  type: "qris",
  accountLabel: "QRIS",
  accountNumber: "",
  accountName: "",
  qrImage: "",
  logo: "",
  instructions: [],
  isActive: true,
});

export function PaymentEditor({ methods, action }: PaymentEditorProps) {
  const [draft, setDraft] = useState<PaymentMethod[]>(methods);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (id: string, patch: Partial<PaymentMethod>) => {
    setDraft((current) =>
      current.map((method) => (method.id === id ? { ...method, ...patch } : method)),
    );
    setStatus(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    const copy = [...draft];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved as PaymentMethod);
    setDraft(copy);
    setStatus(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await action(draft);
      setStatus(result);
      if (result.ok) setEditingId(null);
    });
  };

  const activeCount = draft.filter((method) => method.isActive).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="mr-auto text-xs text-slate-500">
          <b className="text-slate-700">{activeCount}</b> dari {draft.length} metode aktif. Hanya
          metode aktif yang muncul di halaman pembayaran pembeli.
        </p>
        <button
          type="button"
          onClick={() => {
            const created = blankMethod();
            setDraft((current) => [...current, created]);
            setEditingId(created.id);
            setStatus(null);
          }}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/25 transition-transform grad hover:brightness-110 active:scale-[.98]"
        >
          + Tambah Pembayaran
        </button>
      </div>

      {status ? (
        <p
          role="status"
          className={cx(
            "rounded-2xl border px-4 py-3.5 text-xs font-semibold",
            status.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {status.message}
        </p>
      ) : null}

      <ul className="space-y-3">
        {draft.map((method, index) => {
          const editing = editingId === method.id;
          const ready = isPaymentMethodReady(method);
          const Icon = method.type === "qris" ? SearchIcon : GamepadIcon;

          return (
            <li
              key={method.id}
              className={cx(
                "overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow",
                editing ? "border-blue-300 shadow-md" : "border-slate-200 hover:shadow-md",
              )}
            >
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {method.logo ? (
                    <Image
                      src={method.logo}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  ) : (
                    <Icon className="h-4 w-4 text-slate-400" />
                  )}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-800">
                    {method.name || "(nama belum diisi)"}
                  </p>
                  <p className="text-[11px] text-slate-400">{PAYMENT_TYPE_LABEL[method.type]}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cx(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                      method.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-500",
                    )}
                  >
                    {method.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  {method.isActive && !ready ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                      <ClockBadgeIcon className="h-3 w-3" />
                      Belum lengkap
                    </span>
                  ) : null}
                  {method.isActive && ready ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                      <BadgeCheckIcon className="h-3 w-3" />
                      Siap
                    </span>
                  ) : null}
                </div>

                <div className="ml-auto flex items-center gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Naikkan" className={SMALL}>
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === draft.length - 1}
                    aria-label="Turunkan"
                    className={SMALL}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(editing ? null : method.id)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {editing ? "Tutup" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraft((current) => current.filter((entry) => entry.id !== method.id));
                      if (editing) setEditingId(null);
                      setStatus(null);
                    }}
                    className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 shadow-sm transition-colors hover:bg-rose-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {!editing ? (
                <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                  {method.type === "qris" ? (
                    method.qrImage ? (
                      <Image
                        src={method.qrImage}
                        alt={`QR ${method.name}`}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-xl border border-slate-200 object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <span className="grid h-24 w-24 place-items-center rounded-xl border border-dashed border-slate-300 text-slate-300">
                        <ImageIcon className="h-6 w-6" />
                      </span>
                    )
                  ) : null}
                  <div className="min-w-0 text-xs">
                    {method.type === "transfer" ? (
                      <>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {method.accountLabel}
                        </p>
                        <p className="mono mt-0.5 text-sm font-extrabold text-slate-800">
                          {method.accountNumber || "belum diisi"}
                        </p>
                        {method.accountName ? (
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            a.n. {method.accountName}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-slate-500">
                        {method.qrImage ? "Gambar QR siap dipakai." : "Belum ada gambar QR."}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 px-5 py-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="block text-xs font-bold text-slate-600">
                        Nama metode pembayaran
                      </span>
                      <input
                        value={method.name}
                        onChange={(event) => update(method.id, { name: event.target.value })}
                        placeholder="Contoh: Transfer BCA"
                        className={inputClass}
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="block text-xs font-bold text-slate-600">Tipe pembayaran</span>
                      <select
                        value={method.type}
                        onChange={(event) => {
                          const type = event.target.value as PaymentType;
                          update(method.id, {
                            type,
                            accountLabel:
                              type === "qris"
                                ? method.accountLabel || "QRIS"
                                : method.accountLabel === "QRIS"
                                  ? "Nomor Tujuan"
                                  : method.accountLabel,
                          });
                        }}
                        className={inputClass}
                      >
                        <option value="qris">QRIS / Scan QR</option>
                        <option value="transfer">Transfer Bank / E-Wallet</option>
                      </select>
                    </label>
                  </div>

                  {method.type === "qris" ? (
                    <div className="space-y-1">
                      <span className="block text-xs font-bold text-slate-600">
                        Gambar QRIS <span className="text-rose-500">*</span>
                      </span>
                      <ImageUploadField
                        value={method.qrImage}
                        onChange={(url) => update(method.id, { qrImage: url })}
                        placeholder="Upload gambar QR dari aplikasi bank/e-wallet"
                      />
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="space-y-1">
                        <span className="block text-xs font-bold text-slate-600">
                          Label nomor
                        </span>
                        <input
                          value={method.accountLabel}
                          onChange={(event) =>
                            update(method.id, { accountLabel: event.target.value })
                          }
                          placeholder="Nomor Virtual Account BCA"
                          className={inputClass}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="block text-xs font-bold text-slate-600">
                          Nomor rekening / e-wallet <span className="text-rose-500">*</span>
                        </span>
                        <input
                          value={method.accountNumber}
                          onChange={(event) =>
                            update(method.id, { accountNumber: event.target.value })
                          }
                          placeholder="1234567890"
                          className={inputClass}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="block text-xs font-bold text-slate-600">
                          Nama pemilik rekening
                        </span>
                        <input
                          value={method.accountName}
                          onChange={(event) =>
                            update(method.id, { accountName: event.target.value })
                          }
                          placeholder="PT Juegova Digital"
                          className={inputClass}
                        />
                      </label>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-600">
                      Logo bank / e-wallet <span className="font-normal text-slate-400">(opsional)</span>
                    </span>
                    <ImageUploadField
                      value={method.logo}
                      onChange={(url) => update(method.id, { logo: url })}
                      placeholder="Upload logo supaya pembeli lebih mudah mengenali"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={method.isActive}
                      onChange={(event) => update(method.id, { isActive: event.target.checked })}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      Aktifkan metode ini
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {!ready
                        ? "Lengkapi datanya dulu — kalau belum, metode ini otomatis dinonaktifkan saat disimpan."
                        : "Metode nonaktif tidak muncul di halaman pembayaran."}
                    </span>
                  </label>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        Langkah cara bayar
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Kosongkan untuk memakai langkah bawaan sesuai tipe.
                      </span>
                    </div>
                    {method.instructions.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2">
                        <span className="w-4 text-xs font-bold text-slate-400">
                          {stepIndex + 1}
                        </span>
                        <input
                          value={step}
                          onChange={(event) =>
                            update(method.id, {
                              instructions: method.instructions.map((entry, position) =>
                                position === stepIndex ? event.target.value : entry,
                              ),
                            })
                          }
                          placeholder="Contoh: Buka aplikasi m-banking kamu."
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            update(method.id, {
                              instructions: method.instructions.filter(
                                (_, position) => position !== stepIndex,
                              ),
                            })
                          }
                          className="rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-bold text-rose-600 shadow-sm hover:bg-rose-50"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        update(method.id, { instructions: [...method.instructions, ""] })
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      + Tambah langkah
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
        <p className="mr-auto text-xs text-slate-500">
          Perubahan baru berlaku setelah disimpan.
        </p>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/25 transition-all grad hover:brightness-110 active:scale-[.98] disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Simpan metode pembayaran"}
        </button>
      </div>
    </div>
  );
}
