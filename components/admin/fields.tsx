"use client";

import { useState, useTransition } from "react";
import { cx } from "@/lib/cx";
import type { ActionResult } from "@/types";
import { ImageUploadField } from "./ImageUploadField";

export type { ActionResult };

export interface FieldDef {
  /** Mendukung dot-path untuk objek bersarang, mis. "contact.email". */
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "toggle" | "image";
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  /** Field yang butuh lebar penuh, mis. textarea atau textarea gambar. */
  wide?: boolean;
  /**
   * Untuk field gambar: nama field tetangga yang diisi otomatis dari ukuran file
   * hasil upload, supaya rasio gambarnya tidak perlu diketik manual.
   */
  sizeFields?: { width: string; height: string };
}

type AnyRecord = Record<string, unknown>;

export function getPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((acc, key) => (acc as AnyRecord | undefined)?.[key], source);
}

function setPath(source: AnyRecord, path: string, value: unknown): AnyRecord {
  const [head, ...rest] = path.split(".");
  if (!head) return source;
  if (rest.length === 0) return { ...source, [head]: value };
  return {
    ...source,
    [head]: setPath((source[head] as AnyRecord | undefined) ?? {}, rest.join("."), value),
  };
}

/** Membungkus nilai jadi patch bersarang, mis. ("navigation.header", data) -> { navigation: { header: data } }. */
function buildPatch(path: string, value: unknown): AnyRecord {
  const [head, ...rest] = path.split(".");
  if (!head) return {};
  return rest.length === 0 ? { [head]: value } : { [head]: buildPatch(rest.join("."), value) };
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-colors outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10";

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown, meta?: { width: number; height: number }) => void;
}) {
  if (field.type === "image") {
    return (
      <ImageUploadField
        value={typeof value === "string" ? value : ""}
        placeholder={field.placeholder}
        onChange={(url, meta) => onChange(url, meta)}
      />
    );
  }

  if (field.type === "toggle") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        {field.help ?? "Aktif"}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className={inputClass}
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={value === null || value === undefined ? "" : String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        placeholder={field.placeholder}
        className={inputClass}
      />
    );
  }

  return (
    <input
      type="text"
      value={value === null || value === undefined ? "" : String(value)}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      className={inputClass}
    />
  );
}

export function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: AnyRecord;
  onChange: (name: string, next: unknown) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.name}
          className={cx(
            "space-y-1",
            (field.wide || field.type === "textarea" || field.type === "image") && "sm:col-span-2",
          )}
        >
          <label className="block text-xs font-bold text-slate-600">{field.label}</label>
          <FieldInput
            field={field}
            value={getPath(values, field.name)}
            onChange={(next, meta) => {
              onChange(field.name, next);
              // Ukuran file hasil upload langsung mengisi field lebar/tinggi.
              if (meta && field.sizeFields && meta.width > 0) {
                onChange(field.sizeFields.width, meta.width);
                onChange(field.sizeFields.height, meta.height);
              }
            }}
          />
          {field.help && field.type !== "toggle" ? (
            <p className="text-[11px] text-slate-400">{field.help}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
        <h2 className="text-sm font-extrabold text-slate-800">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
        ) : null}
      </header>
      <div className="px-5 py-5">{children}</div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
        {footer}
      </footer>
    </section>
  );
}

const SMALL_BUTTON =
  "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-500 shadow-sm transition-colors disabled:opacity-40 disabled:shadow-none";

export function SaveButton({ pending, label = "Simpan" }: { pending: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/25 transition-all duration-200 grad hover:brightness-110 active:scale-[.98] disabled:opacity-60 disabled:shadow-none"
    >
      {pending ? "Menyimpan..." : label}
    </button>
  );
}

export function StatusText({ status }: { status: ActionResult | null }) {
  if (!status) return null;
  return (
    <span
      role="status"
      className={cx("text-xs font-semibold", status.ok ? "text-emerald-600" : "text-red-600")}
    >
      {status.message}
    </span>
  );
}

/** Editor untuk daftar teks sederhana (mis. langkah "Cara Top Up"). */
export function StringListEditor({
  title,
  description,
  initialItems,
  action,
  patchPath,
  placeholder,
  addLabel = "Tambah baris",
  submitLabel,
}: {
  title: string;
  description?: string;
  initialItems: string[];
  action: (patch: AnyRecord) => Promise<ActionResult>;
  patchPath: string;
  placeholder?: string;
  addLabel?: string;
  submitLabel?: string;
}) {
  const [items, setItems] = useState<string[]>(initialItems);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved ?? "");
    setItems(copy);
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(buildPatch(patchPath, items))));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
          </>
        }
      >
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 text-xs font-bold text-slate-400">{index + 1}</span>
              <input
                value={item}
                onChange={(event) => {
                  setItems((current) =>
                    current.map((entry, position) =>
                      position === index ? event.target.value : entry,
                    ),
                  );
                  setStatus(null);
                }}
                placeholder={placeholder}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Naikkan"
                className={cx(SMALL_BUTTON, "hover:bg-slate-50 hover:text-slate-700")}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Turunkan"
                className={cx(SMALL_BUTTON, "hover:bg-slate-50 hover:text-slate-700")}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => {
                  setItems((current) => current.filter((_, position) => position !== index));
                  setStatus(null);
                }}
                aria-label="Hapus"
                className={cx(SMALL_BUTTON, "border-rose-200 text-rose-600 hover:bg-rose-50")}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setItems((current) => [...current, ""]);
            setStatus(null);
          }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          + {addLabel}
        </button>
      </Panel>
    </form>
  );
}

/** Form untuk satu objek datar (mendukung dot-path untuk properti bersarang). */
export function ObjectEditor({
  title,
  description,
  fields,
  initial,
  action,
  patchPath,
  submitLabel,
}: {
  title: string;
  description?: string;
  fields: FieldDef[];
  initial: object;
  /** Server action dari app/admin/actions.ts. */
  action: (patch: AnyRecord) => Promise<ActionResult>;
  /** Di mana nilai ini disimpan di dokumen konten, mis. "settings" atau "settings.contact". */
  patchPath: string;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<AnyRecord>(initial as AnyRecord);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const handleChange = (name: string, next: unknown) => {
    setValues((current) => setPath(current, name, next));
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(buildPatch(patchPath, values))));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
          </>
        }
      >
        <FieldGrid fields={fields} values={values} onChange={handleChange} />
      </Panel>
    </form>
  );
}

/** Editor daftar: tambah, hapus, geser naik/turun, lalu simpan sekaligus. */
export function RepeatableEditor<T extends object>({
  title,
  description,
  fields,
  initialItems,
  emptyItem,
  action,
  patchPath,
  titleField,
  titlePrefix = "Item",
  addLabel = "Tambah item",
  submitLabel,
  emptyLabel = "Belum ada item.",
}: {
  title: string;
  description?: string;
  fields: FieldDef[];
  initialItems: T[];
  /** Template untuk item baru. Dikirim sebagai data karena fungsi tidak bisa lewat batas server/client. */
  emptyItem: T;
  action: (patch: AnyRecord) => Promise<ActionResult>;
  patchPath: string;
  /** Nama field yang dipakai sebagai judul tiap baris. */
  titleField?: string;
  titlePrefix?: string;
  addLabel?: string;
  submitLabel?: string;
  emptyLabel?: string;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const labelFor = (item: T, index: number) => {
    const value = titleField ? getPath(item, titleField) : null;
    const text = typeof value === "string" && value.trim() ? value : null;
    return `${titlePrefix} ${index + 1}${text ? ` — ${text}` : ""}`;
  };

  const updateItem = (index: number, name: string, next: unknown) => {
    setItems((current) =>
      current.map((item, position) =>
        position === index
          ? (setPath(item as unknown as AnyRecord, name, next) as T)
          : item,
      ),
    );
    setStatus(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved as T);
      return copy;
    });
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(buildPatch(patchPath, items))));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
            <span className="ml-auto text-[11px] text-slate-400">{items.length} item</span>
          </>
        }
      >
        {items.length === 0 ? (
          <p className="text-xs text-slate-400">{emptyLabel}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-700">
                    {labelFor(item, index)}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Naikkan"
                      className={cx(SMALL_BUTTON, "hover:bg-slate-50 hover:text-slate-700")}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Turunkan"
                      className={cx(SMALL_BUTTON, "hover:bg-slate-50 hover:text-slate-700")}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItems((current) => current.filter((_, position) => position !== index));
                        setStatus(null);
                      }}
                      aria-label="Hapus"
                      className={cx(SMALL_BUTTON, "border-rose-200 text-rose-600 hover:bg-rose-50")}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <FieldGrid
                  fields={fields}
                  values={item as unknown as AnyRecord}
                  onChange={(name, next) => updateItem(index, name, next)}
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setItems((current) => [...current, structuredClone(emptyItem)]);
            setStatus(null);
          }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          + {addLabel}
        </button>
      </Panel>
    </form>
  );
}
